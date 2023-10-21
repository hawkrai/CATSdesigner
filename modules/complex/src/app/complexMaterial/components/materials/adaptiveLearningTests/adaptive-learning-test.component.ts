import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject, timer } from 'rxjs'
import { Test } from '../../../../models/Test'
import { TestService } from '../../../../service/test.service'
import { TestQuestion } from '../../../../models/question/TestQuestion'
declare var $: any

@Component({
  selector: 'app-test-execution',
  templateUrl: './adaptive-learning-test.component.html',
  styleUrls: ['./adaptive-learning-test.component.less'],
})
export class TestExecutionComponent implements OnInit {
  @Input()
  testId: string

  public question: TestQuestion
  public questionNumber: string
  public test: Test
  public questionArray: number[]
  public allAnswersArray: number[] = []
  public trueAnswersArray: number[] = []
  public falseAnswersArray: number[] = []
  public result: any
  public counter$: Observable<string>
  public count = 60
  public showTest: boolean
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.questionNumber = '1'
    this.showTest = true
    this.testService
      .getTestById(this.testId)
      .pipe(
        tap((test) => {
          this.test = test
          this.fillQuestionArray()
        }),
        switchMap((test) =>
          this.testService.getNextQuestion(
            this.testId,
            this.questionNumber,
            !test.ForSelfStudy
          )
        ),
        tap((question: TestQuestion) => {
          this.question = question
          if (!this.question.Seconds && this.question.Seconds === 0) {
            //this.router.navigate(["/test-result"]);
          }
          this.questionNumber = question && question.Number.toString()
          this.allAnswersArray = question && question.IncompleteQuestionsNumbers
          this.counter$ = timer(0, 1000).pipe(
            take(this.question.Seconds),
            map(() => {
              if (this.question.Seconds && this.question.Seconds != 0) {
                --this.question.Seconds
                const hour: number = Math.floor(this.question.Seconds / 3600)
                let restTime: number = this.question.Seconds - 3600 * hour
                const minute: number = Math.floor(restTime / 60)
                restTime = restTime - 60 * minute
                if (hour === 0 && minute === 0 && restTime === 0) {
                  //this.router.navigate(["/test-result"]);
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
                //this.router.navigate(["/test-result"]);
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
        const index = this.questionArray.indexOf(Number(this.questionNumber))
        const index1 = this.allAnswersArray.indexOf(Number(this.questionNumber))
        this.questionArray.splice(index, 1)
        if (answer.isTrue) {
          this.allAnswersArray.splice(index1, 1)
          this.trueAnswersArray.push(Number(this.questionNumber))
        } else {
          this.allAnswersArray.splice(index1, 1)
          this.falseAnswersArray.push(Number(this.questionNumber))
        }
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
            !this.test.ForSelfStudy
          )
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe((question: TestQuestion) => {
            if (question && question.Question) {
              this.question = question
            } else {
              this.router.navigate(['/test-result'], {
                queryParams: { testId: this.test.Id },
              })
            }
          })
      } else {
        this.showTest = false
        $('#continueButton').attr('disabled', false)
      }
    } else {
      debugger
      this.router.navigate(['/test-result'], {
        queryParams: { testId: this.test.Id },
      })
    }
  }

  private fillQuestionArray(): void {
    this.questionArray = Array.from(
      Array(this.test.CountOfQuestions),
      (x, index) => index + 1
    )
    console.log('this.questionArray', this.questionArray)
  }
}
