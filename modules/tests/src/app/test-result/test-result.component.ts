import { Component, OnInit } from '@angular/core'
import { TestPassingService } from '../service/test-passing.service'
import { ActivatedRoute, Router } from '@angular/router'
import { UserAnswers } from '../models/user-answers.model'
import { catchError, finalize, takeUntil } from 'rxjs/operators'
import { AutoUnsubscribe } from '../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../core/auto-unsubscribe-base'
import { of, Subject } from 'rxjs'
import moment from 'moment'
import { ClosedTestResult } from '../models/closed-test-result.model'
import { DataValues } from '../models/data-values.model'
import { Constants } from '../models/constanst/DataConstants'
import * as neuralNetworkV2 from '../core/neuron/neuron1.js'
import { CatsService } from '../service/cats.service'
import { StorageKeys } from '../../../../../container/src/app/core/models/storage-keys.enum'

interface Theme {
  name: string
  id: number
}

interface NNItem {
  theme: string
  status: boolean
  score: number
}

@AutoUnsubscribe
@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.less'],
})
export class TestResultComponent extends AutoUnsubscribeBase implements OnInit {
  public result: UserAnswers[]
  public testName: string
  public testId: string
  public isLoading = true
  public mark: number = 0
  public endTime: string
  public startTime: string
  public percent: number
  public endDate: string
  public isNN: boolean
  public themes: Theme[]
  public displayedColumns = ['theme', 'status', 'score']
  public nnDatasource: NNItem[] = []
  public isFromEUMK: boolean = false
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    private testPassingService: TestPassingService,
    private router: Router,
    private route: ActivatedRoute,
    private catsService: CatsService
  ) {
    super()
  }

  ngOnInit() {
    this.testId = this.route.snapshot.queryParamMap.get('testId')
    
    const fromEUMKParam = this.route.snapshot.queryParamMap.get('fromEUMK')
    const testFromComplexFlag = sessionStorage.getItem(StorageKeys.TestFromComplex)
    const complexRoute = sessionStorage.getItem(StorageKeys.ComplexRoute)
    
    this.isFromEUMK = fromEUMKParam === 'true' || testFromComplexFlag === 'true' || !!complexRoute
    
    if (sessionStorage.getItem(StorageKeys.ComplexTestId)) {
      sessionStorage.removeItem(StorageKeys.ComplexTestId)
    }
    
    this.testPassingService
      .CloseTestAndGetResult(this.testId)
      .pipe(
        takeUntil(this.unsubscribeStream$),
        catchError(() => of(null)),
        finalize(() => {
          this.isLoading = false
        })
      )
      .subscribe((result: ClosedTestResult) => {
        if (!result || !Array.isArray(result.Data)) {
          this.result = []
          return
        }

        const answers = this.getDataValue<UserAnswers[]>(result.Data, Constants.ANSWERS, [])
        const testName = this.getDataValue<string>(result.Data, Constants.TEST_NAME, '')
        const mark = this.getDataValue<number>(result.Data, Constants.MARK, 0)
        const percent = this.getDataValue<number>(result.Data, Constants.PERCENT, 0)
        const startTimeRaw = this.getDataValue<any>(result.Data, Constants.START_TIME, null)
        const endTimeRaw = this.getDataValue<any>(result.Data, Constants.END_TIME, null)
        const themes = this.getDataValue<Theme[]>(result.Data, Constants.THEMS, [])
        const neuralRaw = this.getDataValue<string>(result.Data, Constants.NEURAL_DATA, null)

        this.result = answers || []
        this.testName = testName || ''
        this.mark = mark || 0
        this.percent = percent || 0
        this.startTime = startTimeRaw ? moment(startTimeRaw).format('HH:mm:ss') : '—'
        this.endTime = endTimeRaw ? moment(endTimeRaw).format('HH:mm:ss') : '—'
        this.endDate = endTimeRaw ? moment(endTimeRaw).format('DD.MM.YYYY') : '—'
        this.themes = (themes || []).reduce(
          (old, item: Theme) =>
            old.find((x) => x.id === item.id) ? old : [...old, item],
          []
        )
        this.isNN = !!this.getDataValue<any>(result.Data, Constants.FO_NN, null)

        if (this.isNN && neuralRaw) {
          neuralNetworkV2.neuralNetworkV2.fromJSON(JSON.parse(neuralRaw))
          const nnResult = neuralNetworkV2.neuralNetworkV2.run(
            this.result.map((x) => (x.Points !== 0 ? 1 : 0))
          )
          for (const [index, value] of nnResult.entries()) {
            const status = !(parseFloat(value) > 0.7)
            const score = value
            const theme = this.themes[index]?.name || ''

            this.nnDatasource.push({
              status,
              score,
              theme,
            })
          }
        }
      })
  }

  private getDataValue<T>(
    data: DataValues[],
    key: string,
    defaultValue: T
  ): T {
    const item = data.find((res: DataValues) => res.Key === key)
    return (item?.Value as T) ?? defaultValue
  }

  public navigate(): void {
    if (this.isFromEUMK) {
      const complexId = sessionStorage.getItem(StorageKeys.ComplexId)
      const complexRoute = sessionStorage.getItem(StorageKeys.ComplexRoute)

      sessionStorage.removeItem(StorageKeys.TestFromComplex)
      
      if (complexId) {
        sessionStorage.removeItem(StorageKeys.ComplexId)
        localStorage.setItem(StorageKeys.SelectedComplex, complexId)
      }
      
      if (complexRoute) {
        sessionStorage.removeItem(StorageKeys.ComplexRoute)
        this.catsService.sendMessage({
          Type: 'Route',
          Value: complexRoute,
        })
      } else {
        this.router.navigate(['/test-control'])
      }
    } else {
      this.router.navigate(['/test-control'])
    }
  }
}
