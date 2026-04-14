import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core'
import { MatDialog } from '@angular/material'
import { AnswersPopupComponent } from './components/answers-popup/answers-popup.component'
import * as pluginDataLabels from 'chartjs-plugin-datalabels'
import { Label } from 'ng2-charts'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js'
import { AutoUnsubscribe } from '../../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../../core/auto-unsubscribe-base'
import { Subject } from 'rxjs'
import { finalize, takeUntil } from 'rxjs/operators'
import { TestPassingService } from '../../service/test-passing.service'
import { TranslatePipe } from 'educats-translate'
import { Help } from '../../models/help.model'
import { Constants } from '../../models/constanst/DataConstants'
import { DataValues } from '../../models/data-values.model'
import { TestResult, StudentData, StudentMapEntry } from '../../models/student-test-result.model'
import moment from 'moment'

@AutoUnsubscribe
@Component({
  selector: 'app-result-test-table',
  templateUrl: './result-test-table.component.html',
  styleUrls: ['./result-test-table.component.less'],
})
export class ResultTestTableComponent
  extends AutoUnsubscribeBase
  implements OnInit, OnChanges
{
  private tooltipDatesCache = new Map<
    string,
    { startTime: string | null; endTime: string | null }
  >()
  private tooltipFetchInFlight = new Set<string>()
  private tooltipRequestGeneration = 0
  public barChartColors: any[] = [{ backgroundColor: '#1976D2' }]
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 10,
          },
        },
      ],
    },
    aspectRatio: 6,
    tooltips: {
      backgroundColor: '#fff',
      bodyFontColor: '#000',
      titleFontColor: '#000',
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  }
  public barChartLabels: Label[] = []
  public barChartType: ChartType = 'bar'
  public barChartLegend = true
  public barChartPlugins = [pluginDataLabels]
  public barChartData: ChartDataSets[]
  public showChart: boolean = false
  @Input()
  public tests: any
  @Input()
  public size: number

  @Input()
  public group: string

  @Input()
  public groupId: string
  @Input()
  public forSelf: boolean = false

  @Input()
  public showAsSubGroup: boolean
  @Input()
  public name: string

  @Input()
  public testName: string
  public scareThing: any = []
  @Input()
  public loading: boolean
  public testSize: number
  public averageMarkForTest: any
  public averagePercentForTest: any

  displayedColumns: string[] = ['Id', 'Name']
  @Output()
  public sendAverageMarks: EventEmitter<any> = new EventEmitter()
  public help: Help
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    public dialog: MatDialog,
    private translatePipe: TranslatePipe,
    private testPassingService: TestPassingService,
    private translate: TranslatePipe
  ) {
    super()
    this.help = {
      message: this.translatePipe.transform(
        'text.help.lectures',
        'Чтобы посмотреть результаты тестов, выберите нужную группу и тип теста. Также можно посмотреть результаты тестов по подгруппам и каждого отдельного студента.'
      ),
      action: this.translatePipe.transform('button.understand', 'Понятно'),
    }
  }

  ngOnInit() {
    this.barChartData = [
      {
        data: [],
        label: this.translatePipe.transform(
          'text.test.average_mark',
          ' Средняя оценка'
        ),
      },
    ]
    for (let i = 0; i < 3; i++) {
      this.scareThing.push(Array.from(this.tests[i].entries()))
    }
    this.testSize =
      this.scareThing &&
      ((this.scareThing[0] &&
        this.scareThing[0][0] &&
        this.scareThing[0][0][1] &&
        this.scareThing[0][0][1].test &&
        this.scareThing[0][0][1].test.length) ||
        (this.scareThing[1] &&
          this.scareThing[1][0] &&
          this.scareThing[1][0][1] &&
          this.scareThing[1][0][1].test &&
          this.scareThing[1][0][1].test.length) ||
        (this.scareThing[2] &&
          this.scareThing[2][0] &&
          this.scareThing[2][0][1] &&
          this.scareThing[2][0][1].test &&
          this.scareThing[2][0][1].test.length))
    for (let i = 0; i < this.testSize; i++) {
      this.displayedColumns.push('test' + i)
    }
    this.displayedColumns.push('average')
    this.getAverageMark()
    const getAverageResult = this.getAverageMarkForTest()

    this.averageMarkForTest = getAverageResult[0]
    this.averagePercentForTest = getAverageResult[1]

    for (const subGroup of this.scareThing) {
      if (subGroup.length) {
        subGroup.push(subGroup[0])
      }
    }
  } //todo average marks from backend

  public openAnswersDialog(
    openDialog: any,
    name: string,
    testName: string,
    event?: any,
    id?: any
  ): void {
    const hasPassedScore = openDialog !== null && openDialog !== undefined
    if (!hasPassedScore || !event || !id) return

    const studentId = id.toString()
    const testId = event.toString()
    const cacheKey = `${testId}_${studentId}`

    this.testPassingService
      .getAnswersByStudentAndTest(studentId, testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe({
        next: (answers: DataValues[]) => {
          const testInfo: any = answers.find(
            (res: DataValues) => res.Key === Constants.TEST_INFO
          )?.Value

          const userAnswers: any[] | undefined = answers.find(
            (res: DataValues) => res.Key === Constants.USER_ANSWERS
          )?.Value

          this.tooltipDatesCache.set(cacheKey, {
            startTime: testInfo?.StartTime || null,
            endTime: testInfo?.EndTime || null,
          })

          const hasUsableTestInfo =
            !!testInfo &&
            testInfo.Points != null &&
            testInfo.Percent != null

          const hasRenderableUserAnswers =
            Array.isArray(userAnswers) &&
            userAnswers.some(
              (a) =>
                !!a &&
                ((typeof a.QuestionTitle === 'string' &&
                  a.QuestionTitle.trim().length > 0) ||
                  (typeof a.AnswerString === 'string' &&
                    a.AnswerString.trim().length > 0))
            )

          if (!hasUsableTestInfo || !hasRenderableUserAnswers) {
            return
          }

          const dialogRef = this.dialog.open(AnswersPopupComponent, {
            width: '800px',
            data: {
              event,
              id,
              name,
              testName,
              preloadedUserAnswers: userAnswers,
              preloadedTestInfo: testInfo,
            },
            disableClose: false,
            autoFocus: false,
            panelClass: 'test-modal-container',
          })

          dialogRef
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeStream$))
            .subscribe()
        },
        error: () => {
          this.tooltipDatesCache.set(cacheKey, {
            startTime: null,
            endTime: null,
          })
        },
      })
  }

  public downloadExcel(): void {
    const subject = JSON.parse(localStorage.getItem('currentSubject'))
    this.testPassingService
      .downloadExcel(this.groupId, subject.id, this.forSelf)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe()
  }

  private getAverageMark(): void {
    const mass = []
    for (const subGroup of this.scareThing) {
      if (subGroup.length != 0) {
        for (const pupil of subGroup) {
          let sumOfMarks: number = 0
          for (const test of pupil[1].test) {
            sumOfMarks += test.points
          }
          const entire = []
          const testSize = pupil[1].test.filter((x) =>
            Number.isInteger(x.points)
          ).length
          entire.push(this.getShortName(pupil))
          const averageMark =
            testSize > 0 ? (sumOfMarks / testSize).toFixed(1) : '0'
          entire.push(averageMark)
          mass.push(entire)
          pupil.push(averageMark)
          if (this.size) {
            pupil.push(
              pupil[1].test.length === this.size &&
                pupil[1].test.every((test) => test.percent)
            )
          }
        }
      }
    }
    const sortedDescPoints = mass.sort((a, b) => {
      return b[1] - a[1]
    })
    for (const entire of sortedDescPoints) {
      this.barChartLabels.push(entire[0])
      this.barChartData[0].data.push(entire[1])
    }
    this.showChart = (<number[]>this.barChartData[0]?.data).some(
      (value) => value.toString() != 'NaN'
    )
  }

  private getAverageMarkForTest(): any {
    const result = []
    const resultPercent = []
    for (const subGroup of this.scareThing) {
      if (subGroup.length !== 0) {
        const sumOfMarks = {}
        const sumOfPercents = {}
        const countOfValidResults = {}
        for (const pupil of subGroup) {
          for (const test of pupil[1].test) {
            if (
              (test.percent === undefined && test.points === undefined) ||
              (test.percent === null && test.points === null)
            ) {
              continue
            }
            if (sumOfMarks[test.testId] === undefined) {
              sumOfMarks[test.testId] = 0
              countOfValidResults[test.testId] = 0
              sumOfPercents[test.testId] = 0
            }
            countOfValidResults[test.testId]++
            sumOfMarks[test.testId] +=
              test.points !== undefined ? test.points : test.percent / 10
            sumOfPercents[test.testId] +=
              test.percent !== undefined ? test.percent : test.points * 10
          }
        }
        let sumOfAverageMarks = 0
        let sumOfAveragePercents = 0
        let amountOfTests = 0
        for (const [testId, value] of Object.entries(sumOfMarks)) {
          if (!countOfValidResults[testId]) {
            sumOfMarks[testId] = null
            sumOfPercents[testId] = null
          } else {
            amountOfTests++
            sumOfAverageMarks +=
              sumOfMarks[testId] / countOfValidResults[testId]
            sumOfMarks[testId] =
              sumOfMarks[testId] / countOfValidResults[testId]

            sumOfAveragePercents +=
              sumOfPercents[testId] / countOfValidResults[testId]
            sumOfPercents[testId] =
              sumOfPercents[testId] / countOfValidResults[testId]
          }
        }

        sumOfMarks['average'] = sumOfAverageMarks / amountOfTests
        sumOfMarks['averagePercent'] = sumOfAveragePercents / amountOfTests

        result.push(sumOfMarks)
        resultPercent.push(sumOfPercents)
      }
    }

    return [result, resultPercent]
  }

  private getShortName(pupil): string {
    const pupilName: string[] = pupil[1].name.split(' ')
    return (
      pupilName[0] +
      ' ' +
      pupilName[1][0] +
      '.' +
      (pupilName[2] ? pupilName[2][0] + '.' : '')
    )
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.tests && !changes.tests.firstChange) {
      this.tooltipRequestGeneration++
      this.tooltipDatesCache.clear()
      this.tooltipFetchInFlight.clear()
    }
  }

  getAverageTooltip(element) {
    const testsArray = element[1].test
    const testsCount = testsArray.length
    const passedTests = testsArray.filter((x) =>
      Number.isInteger(x.points)
    ).length
    return this.translate.transform(
      'text.tests.written',
      `Написано ${passedTests} тестов из ${testsCount}`,
      { actualCount: passedTests.toString(), testsCount: testsCount.toString() }
    )
  }

  getTestTooltip(testResult: any): string {
    if (!testResult) {
      return this.translate.transform(
        'text.test.no.data',
        'Нет данных о тесте'
      );
    }

    let tooltip = testResult.testName || this.translate.transform(
      'text.test',
      'Тест'
    );

      if (testResult.points !== null && testResult.points !== undefined) {
      const markLabel = this.translate.transform('text.test.mark', 'Оценка');
      tooltip += `\n${markLabel}: ${testResult.points}`;

      if (testResult.percent !== null && testResult.percent !== undefined) {
        tooltip += ` (${testResult.percent}%)`;
      }

      const cacheKey = `${testResult.testId}_${testResult.studentId}`;

      if (this.tooltipDatesCache.has(cacheKey)) {
        const dates = this.tooltipDatesCache.get(cacheKey)!;
        if (dates.startTime) {
          const formattedDate = this.formatDateTimeForTooltip(dates.startTime, 'date');
          const formattedStartTime = this.formatDateTimeForTooltip(dates.startTime, 'time');
          let formattedEndTime = '';

          if (dates.endTime) {
            formattedEndTime = this.formatDateTimeForTooltip(dates.endTime, 'time');
          }

          if (formattedDate) {
            const dateLabel = this.translate.transform(
              'text.test.date.completing.header',
              'Дата прохождения теста'
            );
            tooltip += `\n${dateLabel}: ${formattedDate}`;
          }

          if (formattedStartTime) {
            const startTimeLabel = this.translate.transform(
              'text.test.time.start.header',
              'Время начала теста'
            );
            tooltip += `\n${startTimeLabel}: ${formattedStartTime}`;
          }

          if (formattedEndTime) {
            const endTimeLabel = this.translate.transform(
              'text.test.time.end.header',
              'Время окончания теста'
            );
            tooltip += `\n${endTimeLabel}: ${formattedEndTime}`;
          }
          } else {
            const noAdditionalInfo = this.translate.transform(
              'text.test.no.additional.information',
              'Нет дополнительной информации'
            )
            tooltip += `\n${noAdditionalInfo}`
        }
      } else if (testResult.testId && testResult.studentId) {
        if (!this.tooltipFetchInFlight.has(cacheKey)) {
          this.loadDatesForTooltip(
            testResult.testId,
            testResult.studentId,
            cacheKey
          )
        }
        const loadingLabel = this.translate.transform(
          'text.test.loading.time.data',
          'Загрузка...'
        )
        tooltip += `\n${loadingLabel}`
      }
    } else {
      const statusLabel = this.translate.transform(
        'text.test.status.not.passed',
        'Статус: тест не пройден'
      );
      tooltip += `\n${statusLabel}`;
    }

    return tooltip;
  }

  private formatDateTimeForTooltip(dateTimeString: string, format: 'date' | 'time'): string {
    if (!dateTimeString ||
      dateTimeString === 'null' ||
      dateTimeString === 'undefined' ||
      dateTimeString.includes('/Date(-62135596800000)/')) {
      return '';
    }

    try {
      let timestamp: number;

      if (dateTimeString.includes('/Date(')) {
        const match = dateTimeString.match(/\/Date\((-?\d+)\)\//);
        if (!match) {
          return '';
        }
        timestamp = parseInt(match[1], 10);
      } else {

        const date = new Date(dateTimeString);
        timestamp = date.getTime();
      }

      if (isNaN(timestamp) || timestamp <= 0) {
        return '';
      }

      const dateTime = moment(timestamp);

      if (!dateTime.isValid()) {
        return '';
      }

      return format === 'date'
        ? dateTime.format('DD.MM.YYYY')
        : dateTime.format('HH:mm:ss');

    } catch {
      return '';
    }
  }

  private loadDatesForTooltip(
    testId: number,
    studentId: number,
    cacheKey: string
  ): void {
    if (this.tooltipFetchInFlight.has(cacheKey)) {
      return
    }
    this.tooltipFetchInFlight.add(cacheKey)
    const generation = this.tooltipRequestGeneration
    this.testPassingService
      .getAnswersByStudentAndTest(studentId.toString(), testId.toString())
      .pipe(
        takeUntil(this.unsubscribeStream$),
        finalize(() => this.tooltipFetchInFlight.delete(cacheKey))
      )
      .subscribe({
        next: (answers: DataValues[]) => {
          if (generation !== this.tooltipRequestGeneration) {
            return
          }
          const testInfo = answers.find(
            (res: DataValues) => res.Key === Constants.TEST_INFO
          )?.Value

          if (testInfo?.StartTime) {
            this.tooltipDatesCache.set(cacheKey, {
              startTime: testInfo.StartTime,
              endTime: testInfo.EndTime || null,
            })
          } else {
            this.tooltipDatesCache.set(cacheKey, {
              startTime: null,
              endTime: null,
            })
          }
        },
        error: () => {
          if (generation !== this.tooltipRequestGeneration) {
            return
          }
          this.tooltipDatesCache.set(cacheKey, { startTime: null, endTime: null })
        },
      })
  }
}
