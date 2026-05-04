import { Component, OnInit } from '@angular/core'
import { TestPassingService } from '../service/test-passing.service'
import { TestQuestion } from '../models/question/test-question.model'
import { ActivatedRoute, Router } from '@angular/router'
import { TestService } from '../service/test.service'
import { Test } from '../models/test.model'
import { map, switchMap, takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject, timer } from 'rxjs'
import { AutoUnsubscribe } from '../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../core/auto-unsubscribe-base'
import { StorageKeys } from '../../../../../container/src/app/core/models/storage-keys.enum'
import { UserRole } from '../../../../../container/src/app/core/models/user-role.enum'

@AutoUnsubscribe
@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.css'],
})
export class TestExecutionComponent
  extends AutoUnsubscribeBase
  implements OnInit {
  private static readonly CURRENT_QUESTION_STORAGE_PREFIX =
    'test-execution-current-question-'
  public isLector = false
  public question: TestQuestion
  public questionNumber: string
  public testId: string
  public test: Test
  public questionArray: number[]
  public allAnswersArray: number[] = []
  public trueAnswersArray: number[] = []
  public falseAnswersArray: number[] = []
  public result: any
  public counter$: Observable<string>
  public count = 60
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    private testPassingService: TestPassingService,
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super()
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id')
    this.questionNumber = this.getSavedQuestionNumber()
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'))
      this.isLector = user?.role === UserRole.Lector
    } catch {
      this.isLector = false
    }
    this.testService
      .getTestById(this.testId)
      .pipe(
        tap((test) => {
          this.test = test
          this.fillQuestionArray()
        }),
        switchMap((test) =>
          this.testPassingService.getNextQuestion(
            this.testId,
            this.questionNumber,
            this.shouldExcludeCorrectnessIndicator(test)
          )
        ),
        tap((question: TestQuestion) => {
          this.question = question
          if (!this.question.Seconds && this.question.Seconds === 0) {
            this.clearSavedQuestionNumber()
            const queryParams: any = { testId: this.test.Id }
            if (sessionStorage.getItem(StorageKeys.TestFromComplex) === 'true') {
              queryParams.fromEUMK = 'true'
            }
            this.router.navigate(['/test-result'], {
              queryParams: queryParams,
            })
          }

          this.questionNumber = question && question.Number.toString()
          this.saveQuestionNumber(this.questionNumber)
          this.allAnswersArray = question?.IncompleteQuestionsNumbers || []
          if (this.allAnswersArray.length !== 0) {
            this.questionArray = [...this.allAnswersArray]
          }

          this.counter$ = timer(0, 1000).pipe(
            map(() => {
              if (this.question.Seconds && this.question.Seconds != 0) {
                --this.question.Seconds
                const hour: number = Math.floor(this.question.Seconds / 3600)
                let restTime: number = this.question.Seconds - 3600 * hour
                const minute: number = Math.floor(restTime / 60)
                restTime = restTime - 60 * minute
                if (hour === 0 && minute === 0 && restTime === 0) {
                  this.clearSavedQuestionNumber()
                  const queryParams: any = { testId: this.test.Id }
                  if (sessionStorage.getItem(StorageKeys.TestFromComplex) === 'true') {
                    queryParams.fromEUMK = 'true'
                  }
                  this.router.navigate(['/test-result'], {
                    queryParams: queryParams,
                  })
                }
                return (
                  (hour >= 10 ? hour.toString() : '0' + hour.toString()) +
                  ':' +
                  (minute >= 10 ? minute.toString() : '0' + minute.toString()) +
                  ':' +
                  (restTime >= 10
                    ? restTime.toString()
                    : '0' + restTime.toString())
                )
              } else {
                this.clearSavedQuestionNumber()
                return '00:00:00'
              }
            })
          )
        }),
        takeUntil(this.unsubscribeStream$)
      )
      .subscribe()
  }

  public nextQuestion(answer: any, questionNumber?): void {
    if (this.questionArray.length !== 0) {
      if (questionNumber && !this.questionArray.includes(questionNumber)) {
        return
      }
      if (answer.answered) {
        const currentQuestionNumber = Number(this.questionNumber)
        const index = this.questionArray.indexOf(currentQuestionNumber)
        if (index >= 0) {
          this.questionArray.splice(index, 1)
        }
        this.syncQuestionProgress(currentQuestionNumber, answer.isTrue)
      }
      if (this.questionArray.length !== 0) {
        if (questionNumber && this.questionArray.includes(questionNumber)) {
          this.questionNumber = questionNumber
        } else if (
          questionNumber &&
          !this.questionArray.includes(questionNumber)
        ) {
          this.questionNumber = this.questionArray[0].toString()
        } else if (
          this.questionArray.includes(Number(this.questionNumber) + 1)
        ) {
          this.questionNumber = (Number(this.questionNumber) + 1).toString()
        } else {
          const nextQuestion = this.questionArray.find(
            (value) => value > Number(this.questionNumber)
          )
          if (nextQuestion) {
            this.questionNumber = nextQuestion.toString()
          } else {
            this.questionNumber = this.questionArray[0].toString()
          }
        }
        this.testPassingService
          .getNextQuestion(
            this.testId,
            this.questionNumber,
            this.shouldExcludeCorrectnessIndicator(this.test)
          )
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe((question: TestQuestion) => {
            if (question && question.Question) {
              this.question = question
              this.questionNumber = question.Number?.toString()
              this.saveQuestionNumber(this.questionNumber)
            } else {
              this.clearSavedQuestionNumber()
              const queryParams: any = { testId: this.test.Id }
              if (sessionStorage.getItem(StorageKeys.TestFromComplex) === 'true') {
                queryParams.fromEUMK = 'true'
              }
              this.router.navigate(['/test-result'], {
                queryParams: queryParams,
              })
            }
          })
      } else {
        this.clearSavedQuestionNumber()
        const queryParams: any = { testId: this.test.Id }
        if (sessionStorage.getItem(StorageKeys.TestFromComplex) === 'true') {
          queryParams.fromEUMK = 'true'
        }
        this.router.navigate(['/test-result'], {
          queryParams: queryParams,
        })
      }
    } else {
      this.clearSavedQuestionNumber()
      const queryParams: any = { testId: this.test.Id }
      if (sessionStorage.getItem(StorageKeys.TestFromComplex) === 'true') {
        queryParams.fromEUMK = 'true'
      }
      this.router.navigate(['/test-result'], {
        queryParams: queryParams,
      })
    }
  }

  private fillQuestionArray(): void {
    this.questionArray = Array.from(
      Array(this.test.CountOfQuestions),
      (x, index) => index + 1
    )
  }

  private getSavedQuestionNumber(): string {
    if (!this.testId) {
      return '1'
    }
    const key = this.getCurrentQuestionStorageKey()
    const savedValue = localStorage.getItem(key)
    if (!savedValue) {
      return '1'
    }
    const parsed = Number(savedValue)
    return Number.isInteger(parsed) && parsed > 0 ? parsed.toString() : '1'
  }

  private saveQuestionNumber(questionNumber: string): void {
    if (!this.testId || !questionNumber) {
      return
    }
    localStorage.setItem(this.getCurrentQuestionStorageKey(), questionNumber)
  }

  private clearSavedQuestionNumber(): void {
    if (!this.testId) {
      return
    }
    localStorage.removeItem(this.getCurrentQuestionStorageKey())
  }

  private getCurrentQuestionStorageKey(): string {
    return `${TestExecutionComponent.CURRENT_QUESTION_STORAGE_PREFIX}${this.testId}`
  }

  public showColorAnswerFeedback(): boolean {
    const t = this.test
    if (!t) {
      return false
    }
    if (t.ForSelfStudy) {
      return true
    }
    return (
      this.isLector && !!(t.BeforeEUMK || t.ForEUMK)
    )
  }

  private shouldExcludeCorrectnessIndicator(test: Test): boolean {
    if (test.ForSelfStudy) {
      return false
    }
    if (this.isLector && (test.BeforeEUMK || test.ForEUMK)) {
      return false
    }
    return true
  }

  private syncQuestionProgress(questionNumber: number, isTrue: boolean): void {
    this.allAnswersArray = this.allAnswersArray.filter(
      (value) => value !== questionNumber
    )
    this.trueAnswersArray = this.trueAnswersArray.filter(
      (value) => value !== questionNumber
    )
    this.falseAnswersArray = this.falseAnswersArray.filter(
      (value) => value !== questionNumber
    )

    if (isTrue) {
      this.trueAnswersArray.push(questionNumber)
    } else {
      this.falseAnswersArray.push(questionNumber)
    }
  }
}
