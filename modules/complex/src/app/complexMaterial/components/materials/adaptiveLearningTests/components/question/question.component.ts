import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { catchError, takeUntil, tap } from 'rxjs/operators'
import { of, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { TestService } from '../../../../../../service/test.service'
import { TestQuestion } from '../../../../../../models/question/TestQuestion'
import { Test } from '../../../../../../models/Test'
import { Answer } from '../../../../../../models/question/Answer'
import { UserRole } from '../../../../../../../../../../container/src/app/core/models/user-role.enum'

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
})
export class QuestionComponent implements OnInit {
  private readonly answerComparer = new Intl.Collator(undefined, {
    usage: 'search',
    sensitivity: 'accent',
  })

  @Input()
  public question: TestQuestion

  @Input()
  public questionNumber: string

  @Input()
  public test: Test

  public chosenAnswer: Answer
  public charsNeskolko: { [key: string]: any } = {}
  public charsNew: { [key: string]: any } = {}
  public charsSequence: { [key: string]: any } = {}
  public value = ''

  @Output()
  public goToNextQuestion: EventEmitter<any> = new EventEmitter()
  private unsubscribeStream$: Subject<void> = new Subject<void>()
  private isTrue: boolean
  private answers: number = 0

  constructor(
    private testPassingService: TestService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.question)
  }

  public answerQuestion(): void {
    if (
      this.question.Question.QuestionType === 3 ||
      this.charsNeskolko[0] ||
      this.charsNeskolko[1] ||
      this.charsNeskolko[2] ||
      this.charsNeskolko[3] ||
      this.charsNeskolko[4] ||
      this.charsNeskolko[5] ||
      this.charsNeskolko[6] ||
      this.charsNeskolko[7] ||
      this.charsNeskolko[8] ||
      this.chosenAnswer ||
      this.value
    ) {
      const user = JSON.parse(localStorage.getItem('currentUser'))
      const request = {
        answers: [],
        questionNumber: this.question.Number,
        testId: this.test.Id,
        userId: user.id,
      }
      if (this.question.Question.QuestionType === 0) {
        this.question.Question.Answers.forEach((answer) => {
          if (answer.Id === this.chosenAnswer.Id) {
            request.answers.push({ Id: answer.Id.toString(), IsCorrect: 1 })
          } else {
            request.answers.push({ Id: answer.Id.toString(), IsCorrect: 0 })
          }
        })
      } else if (this.question.Question.QuestionType === 1) {
        this.question.Question.Answers.forEach((answer, index) => {
          request.answers.push({
            Id: answer.Id.toString(),
            IsCorrect: this.charsNeskolko[index] ? 1 : 0,
          })
        })
      } else if (this.question.Question.QuestionType === 2) {
        request.answers.push({ Content: this.value, IsCorrect: 0 })
      } else if (this.question.Question.QuestionType === 3) {
        this.question.Question.Answers.forEach((answer, index) => {
          request.answers.push({ Id: answer.Id.toString(), IsCorrect: index })
        })
      }

      this.isTrue = false
      if (this.canShowAnswers()) {
        this.isTrue = this.checkSelfStudyAnswer(request)
      }

      this.chosenAnswer = null
      this.testPassingService
        .answerQuestionAndGetNext(request)
        .pipe(
          tap(() => {
            this.getOnNextQuestion(true, this.isTrue)
            this.value = ''
          }),
          takeUntil(this.unsubscribeStream$),
          catchError(() => {
            this.router.navigate(['/test-result'], {
              queryParams: { testId: this.test.Id },
            })
            return of(null)
          })
        )
        .subscribe()
    }
  }

  public getOnNextQuestion(answered: boolean, isTrue = false): void {
    this.charsNeskolko = {}
    this.goToNextQuestion.emit({ answered, isTrue })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.question.Question.Answers,
      event.previousIndex,
      event.currentIndex
    )
  }

  private canShowAnswers(): boolean {
    if (!this.test) {
      return false
    }
    if (this.test.ForSelfStudy) {
      return true
    }
    let isLector = false
    try {
      const u = JSON.parse(localStorage.getItem('currentUser'))
      isLector = u && u.role === UserRole.Lector
    } catch (_e) {
      isLector = false
    }
    return isLector && !!(this.test.BeforeEUMK || this.test.ForEUMK)
  }

  private checkSelfStudyAnswer(request): boolean {
    if (this.question.Question.QuestionType === 2) {
      return this.checkSelfStudyTextAnswer(request)
    }
    this.answers = 0
    const answersLength: number = request.answers.length
    request.answers.forEach((answer) => {
      this.question.Question.Answers.forEach((questionAnswer) => {
        if (
          answer.Id === questionAnswer.Id.toString() &&
          answer.IsCorrect === questionAnswer.СorrectnessIndicator
        ) {
          this.answers++
        }
      })
    })
    return this.answers === answersLength
  }

  private normalizeKeyboardAnswer(raw: string | null | undefined): string | null {
    if (raw == null) {
      return null
    }
    const withoutControls = raw
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
    const trimmed = withoutControls.trim()
    return trimmed.length === 0 ? null : trimmed
  }

  private checkSelfStudyTextAnswer(request: {
    answers: Array<{ Content?: string }>
  }): boolean {
    const userEntry = request.answers.find((a) => a.Content != null)
    if (!userEntry) {
      return false
    }
    const normalizedUser = this.normalizeKeyboardAnswer(userEntry.Content)
    if (!normalizedUser) {
      return false
    }
    const referenceKeys = this.question.Question.Answers.map((a) =>
      this.normalizeKeyboardAnswer(a.Content)
    ).filter((ref): ref is string => ref != null && ref !== '')

    return referenceKeys.some(
      (ref) => this.answerComparer.compare(ref, normalizedUser) === 0
    )
  }
}
