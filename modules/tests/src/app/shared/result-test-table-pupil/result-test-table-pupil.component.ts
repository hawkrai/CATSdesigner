import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core'
import { Test } from '../../models/test.model'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js'
import { Label } from 'ng2-charts'
import * as pluginDataLabels from 'chartjs-plugin-datalabels'
import { TestPassingService } from '../../service/test-passing.service'
import { Constants } from '../../models/constanst/DataConstants'
import { Subject, forkJoin } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { DataValues } from '../../models/data-values.model'
import { ChangeDetectorRef } from '@angular/core'
import { StorageKeys } from '../../../../../../container/src/app/core/models/storage-keys.enum'
import { TestDates, TestDatesMap } from '../../models/test-date.model'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-result-test-table-pupil',
  templateUrl: './result-test-table-pupil.component.html',
  styleUrls: ['./result-test-table-pupil.component.less'],
})
export class ResultTestTablePupilComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  public tests: Test[]

  public studentId: string
  public loading: boolean = true

  public testDates: TestDatesMap = {}

  private unsubscribe$ = new Subject<void>()

  private loadingDates = new Set<number>()

  displayedColumns: string[] = ['Id', 'Title', 'passDate', 'startTime', 'endTime', 'action']

  public barChartOptions: ChartOptions = {
    responsive: true,
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
    legend: {
      display: false,
    },
  }

  public barChartColors: any[] = [{ backgroundColor: '#1976D2' }]
  public barChartLabels: Label[] = []
  public barChartType: ChartType = 'bar'
  public barChartLegend = true
  public barChartPlugins = [pluginDataLabels]
  public barChartData: ChartDataSets[] = [{ data: [] }]

  constructor(
    private testPassingService: TestPassingService,
    private translate: TranslatePipe,
    private cdr: ChangeDetectorRef
  ) {
    const currentUser = JSON.parse(localStorage.getItem(StorageKeys.CurrentUser))
    this.studentId = currentUser?.id?.toString()
  }

  ngOnInit() {
    this.loadAllDates()
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  private createTestDates(date: string = '—', startTime: string = '—', endTime: string = '—'): TestDates {
    const testDate = new TestDates();
    testDate.date = date;
    testDate.startTime = startTime;
    testDate.endTime = endTime;
    return testDate;
  }

  private createEmptyTestDates(): TestDates {
    return this.createTestDates();
  }

  private loadAllDates(): void {
    if (!this.tests || !this.tests.length || !this.studentId) return

    const requests = this.tests
      .filter(test => test.Id && !this.testDates[test.Id] && !this.loadingDates.has(test.Id))
      .map(test => {
        this.loadingDates.add(test.Id)

        return this.testPassingService.getAnswersByStudentAndTest(
          this.studentId,
          test.Id.toString()
        ).pipe(
          takeUntil(this.unsubscribe$)
        )
      })

    if (requests.length === 0) return

    forkJoin(requests).subscribe(
      (responses: DataValues[][]) => {
        responses.forEach((answers, index) => {
          const test = this.tests[index]
          if (!test || !test.Id) return

          this.processDateResponse(test.Id, answers)
        })
        this.cdr.detectChanges()
      }
    )
  }

  private processDateResponse(testId: number, answers: DataValues[]): void {
    if (answers && answers.length > 0) {
      const testInfoData = answers.find(
        (res: DataValues) => res.Key === Constants.TEST_INFO
      )

      if (testInfoData?.Value) {
        const startTime = testInfoData.Value.StartTime;
        const endTime = testInfoData.Value.CompletionTime || testInfoData.Value.EndTime;

        const startFormatted = startTime ? this.formatDate(startTime) : { date: '—', time: '—' };
        const endFormatted = endTime ? this.formatDate(endTime) : { date: '—', time: '—' };

        this.testDates[testId] = this.createTestDates(
          startFormatted.date,
          startFormatted.time,
          endFormatted.time
        );
      } else {
        this.testDates[testId] = this.createEmptyTestDates();
      }
    } else {
      this.testDates[testId] = this.createEmptyTestDates();
    }

    this.loadingDates.delete(testId)
  }

  private loadDateForTest(test: Test): void {
    const testId = test.Id

    if (!testId || this.testDates[testId] || this.loadingDates.has(testId) || !this.studentId) {
      return
    }

    this.loadingDates.add(testId)

    this.testPassingService.getAnswersByStudentAndTest(
      this.studentId,
      testId.toString()
    )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (answers: DataValues[]) => {
          this.processDateResponse(testId, answers)
          this.cdr.detectChanges()
        },
        (error) => {
          this.testDates[testId] = this.createEmptyTestDates();
          this.loadingDates.delete(testId)
          this.cdr.detectChanges()
        }
      )
  }

  private formatDate(startTime: string): { date: string, time: string } {
    try {
      let date: Date

      if (startTime.includes('/Date(')) {
        const timestamp = parseInt(startTime.match(/\/Date\((\d+)\)\//)?.[1] || '0')
        date = new Date(timestamp)
      } else {
        date = new Date(startTime)
      }

      if (isNaN(date.getTime())) {
        return { date: '—', time: '—' }
      }

      const pad = (num: number) => num.toString().padStart(2, '0')

      return {
        date: `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`,
        time: `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
      }
    } catch {
      return { date: '—', time: '—' }
    }
  }

  getPassDate(test: Test): string {
    const testId = test.Id

    if (!testId) return '—'

    if (!this.testDates[testId] && !this.loadingDates.has(testId) && this.studentId) {
      setTimeout(() => this.loadDateForTest(test), 0)
      return this.translate.transform('text.test.loading.time.data', 'Загрузка...')
    }

    return this.testDates[testId]?.date || '—'
  }

  getStartTime(test: Test): string {
    const testId = test.Id

    if (!testId) return '—'

    if (!this.testDates[testId] && !this.loadingDates.has(testId) && this.studentId) {
      setTimeout(() => this.loadDateForTest(test), 0)
      return this.translate.transform('text.test.loading.time.data', 'Загрузка...')
    }

    return this.testDates[testId]?.startTime || '—'
  }

  getEndTime(test: Test): string {
    const testId = test.Id

    if (!testId) return '—'

    return this.testDates[testId]?.endTime || '—'
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.tests && this.tests) {
      this.initializeComponent()
    }
  }

  private initializeComponent(): void {
    this.loading = true

    this.resetData()

    this.prepareChartData()

    this.loadAllDates()

    this.loading = false
    this.cdr.detectChanges()
  }

  private resetData(): void {
    this.barChartLabels = []
    this.barChartData = [{ data: [] }]
    this.barChartData[0].data = []
    this.testDates = {}
    this.loadingDates.clear()
  }

  private prepareChartData(): void {
    this.tests.forEach((test: Test) => {
      const displayTitle = test.Title.length > 40
        ? test.Title.substring(0, 40) + '...'
        : test.Title

      this.barChartLabels.push(` ${displayTitle}`)
      this.barChartData[0].data.push(test.Points || 0)
    })
  }
}
