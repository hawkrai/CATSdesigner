import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core'
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators'
import { Observable, of, Subject, timer } from 'rxjs'
import { Test } from '../../../../models/Test'
import { TestService } from '../../../../service/test.service'
import { AdaptivityService } from '../../../../service/adaptivity.service'
import { TestQuestion } from '../../../../models/question/TestQuestion'
import { UserAnswer } from '../../../../models/question/UserAnswer'
import { TestResult } from '../../../../models/TestResult'
import { ThemaStudyResult } from '../../../../models/ThemaStudyResult'
import { TimerValue } from '../../../../models/timer-value.enum'
import { isColorFeedbackTest } from '../../../../models/test-feedback'

@Component({
  selector: 'app-test-execution',
  templateUrl: './adaptive-learning-test.component.html',
  styleUrls: ['./adaptive-learning-test.component.less'],
})
export class TestExecutionComponent implements OnInit, OnDestroy {
  @Input()
  testId: string

  @Input()
  isPredTest = false

  @Input()
  testTitle: string

  @Output()
  learningFlowContinue = new EventEmitter<void>()

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
  public testResult: TestResult
  public themaResults: ThemaStudyResult[] = []
  public counter$: Observable<string>
  public count = 60
  public showTest: boolean
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    private testService: TestService,
    private adaptivityService: AdaptivityService
  ) {}

  ngOnInit() {
    this.questionNumber = '1'
    this.showTest = true
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
    const result$ = isClosedOnServer
      ? this.testService.getEndedTestResult(this.testId)
      : this.testService.closeTestAndGetResult(this.testId)
    result$
      .pipe(
        tap((result: TestResult) => {
          this.testResult = result
          this.outputArray = result.answers
        }),
        switchMap(() =>
          this.adaptivityService
            .getTestThemasResults(this.testId)
            .pipe(catchError(() => of([] as ThemaStudyResult[])))
        ),
        takeUntil(this.unsubscribeStream$)
      )
      .subscribe(
        (themas: ThemaStudyResult[]) => {
          this.themaResults = themas
          this.isResultLoading = false
        },
        () => {
          this.isResultLoading = false
        }
      )
  }

  ngOnDestroy(): void {
    this.unsubscribeStream$.next()
    this.unsubscribeStream$.complete()
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
    return isColorFeedbackTest(this.test)
  }

  private shouldExcludeCorrectnessIndicator(test: Test): boolean {
    return !isColorFeedbackTest(test)
  }

  private fillQuestionArray(): void {
    this.questionArray = Array.from(
      Array(this.test.CountOfQuestions),
      (x, index) => index + 1
    )
  }
}
