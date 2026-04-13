import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { TestPassingService } from '../../../../service/test-passing.service'
import { UserAnswers } from '../../../../models/user-answers.model'
import { AutoUnsubscribe } from '../../../../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../../../../core/auto-unsubscribe-base'
import { of, Subject } from 'rxjs'
import { catchError, takeUntil, tap } from 'rxjs/operators'
import { DataValues } from '../../../../models/data-values.model'
import { Constants } from '../../../../models/constanst/DataConstants'
import moment from 'moment'

@AutoUnsubscribe
@Component({
  selector: 'app-answers-popup',
  templateUrl: './answers-popup.component.html',
  styleUrls: ['./answers-popup.component.less'],
})
export class AnswersPopupComponent
  extends AutoUnsubscribeBase
  implements OnInit
{
  public answers: UserAnswers[]
  private unsubscribeStream$: Subject<void> = new Subject<void>()
  public mark: any
  public percent: any
  public startTime: string
  public startDate: string

  constructor(
    public dialogRef: MatDialogRef<AnswersPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private testPassingService: TestPassingService
  ) {
    super()
  }

  ngOnInit() {
    if (
      Array.isArray(this.data?.preloadedUserAnswers) &&
      this.data?.preloadedTestInfo
    ) {
      const userAnswers = this.data.preloadedUserAnswers
      const testInfo = this.data.preloadedTestInfo

      const hasRenderableAnswers =
        Array.isArray(userAnswers) &&
        userAnswers.some(
          (a) =>
            !!a &&
            ((typeof a.QuestionTitle === 'string' &&
              a.QuestionTitle.trim().length > 0) ||
              (typeof a.AnswerString === 'string' &&
                a.AnswerString.trim().length > 0))
        )

      if (!hasRenderableAnswers) {
        this.dialogRef.close()
        return
      }

      this.answers = userAnswers
      this.mark = testInfo?.Points
      this.percent = testInfo?.Percent

      if (testInfo?.StartTime) {
        this.startTime = moment(testInfo.StartTime).format('HH:mm:ss')
        this.startDate = moment(testInfo.StartTime).format('DD.MM.YYYY')
      } else {
        this.startTime = ''
        this.startDate = ''
      }

      return
    }

    this.testPassingService
      .getAnswersByStudentAndTest(this.data.id, this.data.event)
      .pipe(
        tap((answers: DataValues[]) => {
          const userAnswersEntry = answers.find(
            (res: DataValues) => res.Key === Constants.USER_ANSWERS
          )
          const testInfoEntry = answers.find(
            (res: DataValues) => res.Key === Constants.TEST_INFO
          )

          const userAnswers = userAnswersEntry?.Value
          const testInfo = testInfoEntry?.Value
          const hasAnswers =
            Array.isArray(userAnswers) &&
            userAnswers.some(
              (a) =>
                !!a &&
                ((typeof a.QuestionTitle === 'string' &&
                  a.QuestionTitle.trim().length > 0) ||
                  (typeof a.AnswerString === 'string' &&
                    a.AnswerString.trim().length > 0))
            )
          const hasTestInfo =
            !!testInfo &&
            testInfo.Points !== null &&
            testInfo.Points !== undefined &&
            testInfo.Percent !== null &&
            testInfo.Percent !== undefined

          if (!hasAnswers || !hasTestInfo) {
            this.dialogRef.close()
            return
          }

          this.answers = userAnswers
          this.mark = testInfo.Points
          this.percent = testInfo.Percent

          try {
            if (testInfo?.StartTime) {
              this.startTime = moment(testInfo.StartTime).format('HH:mm:ss')
              this.startDate = moment(testInfo.StartTime).format('DD.MM.YYYY')
            } else {
              this.startTime = ''
              this.startDate = ''
            }
          } catch {
            this.startTime = ''
            this.startDate = ''
          }
        }),
        takeUntil(this.unsubscribeStream$),
        catchError(() => {
          this.dialogRef.close()
          return of([])
        })
      )
      .subscribe()
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
