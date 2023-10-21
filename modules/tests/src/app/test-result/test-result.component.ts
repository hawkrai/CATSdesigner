import { Component, OnInit } from '@angular/core'
import { TestPassingService } from '../service/test-passing.service'
import { ActivatedRoute, Router } from '@angular/router'
import { UserAnswers } from '../models/user-answers.model'
import { takeUntil } from 'rxjs/operators'
import { AutoUnsubscribe } from '../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../core/auto-unsubscribe-base'
import { Subject } from 'rxjs'
import moment from 'moment'
import { ClosedTestResult } from '../models/closed-test-result.model'
import { DataValues } from '../models/data-values.model'
import { Constants } from '../models/constanst/DataConstants'
import * as neuralNetworkV2 from '../core/neuron/neuron1.js'

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
  public mark: number = 0
  public endTime: string
  public startTime: string
  public percent: number
  public endDate: string
  public isNN: boolean
  public themes: Theme[]
  public displayedColumns = ['theme', 'status', 'score']
  public nnDatasource: NNItem[] = []
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    private testPassingService: TestPassingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super()
  }

  ngOnInit() {
    this.testId = this.route.snapshot.queryParamMap.get('testId')
    this.testPassingService
      .CloseTestAndGetResult(this.testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result: ClosedTestResult) => {
        this.result = result.Data.find(
          (res: DataValues) => res.Key === Constants.ANSWERS
        ).Value
        this.testName = result.Data.find(
          (res: DataValues) => res.Key === Constants.TEST_NAME
        ).Value
        this.mark = result.Data.find(
          (res: DataValues) => res.Key === Constants.MARK
        ).Value
        this.percent = result.Data.find(
          (res: DataValues) => res.Key === Constants.PERCENT
        ).Value
        this.startTime = moment(
          result.Data.find(
            (res: DataValues) => res.Key === Constants.START_TIME
          ).Value
        ).format('HH:mm:ss')
        this.endTime = moment(
          result.Data.find((res: DataValues) => res.Key === Constants.END_TIME)
            .Value
        ).format('HH:mm:ss')
        this.endDate = moment(
          result.Data.find((res: DataValues) => res.Key === Constants.END_TIME)
            .Value
        ).format('DD.MM.YYYY')
        this.themes = result.Data.find(
          (res: DataValues) => res.Key === Constants.THEMS
        ).Value.reduce(
          (old, item: Theme) =>
            old.find((x) => x.id === item.id) ? old : [...old, item],
          []
        )
        this.isNN = !!result.Data.find(
          (res: DataValues) => res.Key === Constants.FO_NN
        ).Value

        neuralNetworkV2.neuralNetworkV2.fromJSON(
          JSON.parse(
            result.Data.find(
              (res: DataValues) => res.Key === Constants.NEURAL_DATA
            ).Value
          )
        )
        const nnResult = neuralNetworkV2.neuralNetworkV2.run(
          this.result.map((x) => (x.Points !== 0 ? 1 : 0))
        )
        for (const [index, value] of nnResult.entries()) {
          const status = !(parseFloat(value) > 0.7)
          const score = value
          const theme = this.themes[index].name

          this.nnDatasource.push({
            status,
            score,
            theme,
          })
        }
      })
  }

  public navigate(): void {
    this.router.navigate(['/test-control'])
  }
}
