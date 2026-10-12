import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { map, switchMap, takeUntil, tap } from 'rxjs/operators'
import { Observable, of, Subject, timer } from 'rxjs'
import { Test } from '../../../../models/Test'
import { TestService } from '../../../../service/test.service'
import { TestQuestion } from '../../../../models/question/TestQuestion'
import { UserAnswer } from '../../../../models/question/UserAnswer'
import { UserRole } from '../../../../../../../../container/src/app/core/models/user-role.enum'
import { TimerValue } from '../../../../models/timer-value.enum'

@Component({
  selector: 'app-test-execution',
  templateUrl: './adaptive-learning-test.component.html',
  styleUrls: ['./adaptive-learning-test.component.less'],
})
export class TestExecutionComponent implements OnInit {
  @Input()
  testId: string

  @Input()
  isPredTest = false

  @Input()
  testTitle: string

  @Output()
  learningFlowContinue = new EventEmitter<void>()

  public isLector = false
  public isResultLoading = false
  private isTestFinished = false
  public question: TestQuestion
  public questionNumber: string
  public test: Test
  public questionArray: number[]
  public allAnswersArray: number[] = []
  public trueAnswersArray: number[] = []
  public falseAnswersArray: number[] = []
  public outputArray: UserAnswer[] = []
  public result: any
  public counter$: Observable<string>
  public count = 60
  public showTest: boolean
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  public endDate: string
  public startTime: string
  public endTime: string

  constructor(
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.questionNumber = '1'
    this.showTest = true
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'))
      this.isLector = user && user.role === UserRole.Lector
    } catch (_e) {
      this.isLector = false
    }
    const now = new Date()
    this.startTime = now.toLocaleTimeString()
    this.testService
      .getTestById(this.testId)
      .pipe(
        tap((test) => {
          this.test = this.testTitle ? { ...test, Title: this.testTitle } : test
          this.fillQuestionArray()
        }),
        switchMap((test) => this.getFirstQuestion(test)),
        tap((question: TestQuestion) => {
          this.question = question
          if (!this.question.Seconds && this.question.Seconds === 0) {
            this.finishTest()
          }
          this.questionNumber = question && question.Number.toString()
          this.allAnswersArray = question && question.IncompleteQuestionsNumbers
          this.counter$ = timer(0, 1000).pipe(
            map(() => {
              if (this.question.Seconds && this.question.Seconds != 0) {
                --this.question.Seconds
                const hour: number = Math.floor(this.question.Seconds / 3600)
                let restTime: number = this.question.Seconds - 3600 * hour
                const minute: number = Math.floor(restTime / 60)
                restTime = restTime - 60 * minute
                if (hour === 0 && minute === 0 && restTime === 0) {
                  this.finishTest()
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
                return TimerValue.Expired
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
        this.questionArray.splice(index, 1)
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
        this.testService
          .getNextQuestion(
            this.testId,
            this.questionNumber,
            this.shouldExcludeCorrectnessIndicator(this.test)
          )
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe((question: TestQuestion) => {
            if (question && question.Question) {
              this.question = question
            } else {
              this.finishTest(true)
            }
          })
      } else {
        this.finishTest()
      }
    } else {
      this.finishTest()
    }
  }

  public onContinueLearningClick(): void {
    this.learningFlowContinue.emit()
  }

  private getFirstQuestion(test: Test): Observable<TestQuestion> {
    const excludeCorrectness = this.shouldExcludeCorrectnessIndicator(test)
    return this.testService
      .getNextQuestion(this.testId, this.questionNumber, excludeCorrectness)
      .pipe(
        switchMap((question: TestQuestion) =>
          question && question.Question
            ? of(question)
            : this.testService.getNextQuestion(
                this.testId,
                this.questionNumber,
                excludeCorrectness
              )
        )
      )
  }

  private finishTest(isClosedOnServer = false): void {
    if (this.isTestFinished) {
      return
    }
    this.isTestFinished = true
    this.showTest = false
    this.isResultLoading = true
    const answers$ = isClosedOnServer
      ? this.testService.getEndedTestAnswers(this.testId)
      : this.testService.closeTestAndGetAnswers(this.testId)
    answers$.pipe(takeUntil(this.unsubscribeStream$)).subscribe(
      (answers: UserAnswer[]) => {
        this.outputArray = answers || []
        this.isResultLoading = false
      },
      () => {
        this.isResultLoading = false
      }
    )
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

    if (this.showColorAnswerFeedback() && !isTrue) {
      this.falseAnswersArray.push(questionNumber)
    } else {
      this.trueAnswersArray.push(questionNumber)
    }
  }

  public showColorAnswerFeedback(): boolean {
    const t = this.test
    if (!t) {
      return false
    }
    if (t.ForSelfStudy) {
      return true
    }
    return this.isLector && !!(t.BeforeEUMK || t.ForEUMK)
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

  private fillQuestionArray(): void {
    this.questionArray = Array.from(
      Array(this.test.CountOfQuestions),
      (x, index) => index + 1
    )
  }
}
