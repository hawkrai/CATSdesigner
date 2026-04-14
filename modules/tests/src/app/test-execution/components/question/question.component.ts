import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { TestQuestion } from '../../../models/question/test-question.model'
import { Answer } from '../../../models/question/answer.model'
import { TestPassingService } from '../../../service/test-passing.service'
import { Test } from '../../../models/test.model'
import { catchError, takeUntil, tap } from 'rxjs/operators'
import { of, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { AutoUnsubscribe } from '../../../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../../../core/auto-unsubscribe-base'
import { MatSnackBar } from '@angular/material'
import { TranslatePipe } from 'educats-translate'
import { AppToastrService } from '../../../service/toastr.service'
import { StorageKeys } from '../../../../../../../container/src/app/core/models/storage-keys.enum'

@AutoUnsubscribe
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
})
export class QuestionComponent extends AutoUnsubscribeBase implements AfterViewInit {
  @ViewChild('description') descriptionElement: ElementRef<HTMLDivElement>
  private _question
  public get question(): TestQuestion {
    return this._question
  }
  @Input('question')
  public set question(value: TestQuestion) {
    const prevNumber = this._question?.Number
    const nextNumber = value?.Number
    this._question = value
    if (
      value?.Question?.QuestionType === 2 &&
      nextNumber !== prevNumber
    ) {
      this.textAnswer = ''
    }
    this.renderQuestionDescription()
  }

  @Input()
  public questionNumber: string

  @Input()
  public test: Test

  public chosenAnswer: Answer
  public charsNeskolko: { [key: string]: any } = {}
  public charsNew: { [key: string]: any } = {}
  public charsSequence: { [key: string]: any } = {}
  @Output()
  public goToNextQuestion: EventEmitter<any> = new EventEmitter()
  private unsubscribeStream$: Subject<void> = new Subject<void>()
  public textAnswer = ''
  private isTrue: boolean
  private answers: number = 0

  constructor(
    private testPassingService: TestPassingService,
    private snackBar: MatSnackBar,
    private toastr: AppToastrService,
    private translatePipe: TranslatePipe,
    private router: Router
  ) {
    super()
  }

  ngAfterViewInit(): void {
    this.renderQuestionDescription()
  }

  private renderQuestionDescription(): void {
    const el = this.descriptionElement?.nativeElement
    if (!el || !this._question?.Question) {
      return
    }
    el.innerHTML = this._question.Question.Description ?? ''
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
      this.textAnswer
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
        request.answers.push({ Content: this.textAnswer, IsCorrect: 0 })
      } else if (this.question.Question.QuestionType === 3) {
        this.question.Question.Answers.forEach((answer, index) => {
          request.answers.push({ Id: answer.Id.toString(), IsCorrect: index })
        })
      }
      if (this.test.ForSelfStudy) {
        this.isTrue = this.checkSelfStudyAnswer(request)
      }
      this.chosenAnswer = null
      this.testPassingService
        .answerQuestionAndGetNext(request)
        .pipe(
          tap(() => {
            this.getOnNextQuestion(true, this.isTrue)
            this.textAnswer = ''
          }),
          takeUntil(this.unsubscribeStream$),
          catchError(() => {
            const queryParams: any = { testId: this.test.Id }
            if (sessionStorage.getItem(StorageKeys.TestFromComplex) === 'true') {
              queryParams.fromEUMK = 'true'
            }
            this.router.navigate(['/test-result'], {
              queryParams: queryParams,
            })
            return of(null)
          })
        )
        .subscribe()
    } else {
      this.toastr.addErrorFlashMessage(
        this.translatePipe.transform(
          'text.test.choose.variant',
          'Введите ответ'
        )
      )
    }
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'red-snack',
    })
  }

  public getOnNextQuestion(answered: boolean, isTrue = true): void {
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
    const withoutControls = Array.from(raw)
      .filter((ch) => {
        const code = ch.charCodeAt(0)
        return code > 31 && code !== 127
      })
      .join('')
    const trimmed = withoutControls.trim()
    return trimmed.length === 0 ? null : trimmed
  }

  private checkSelfStudyTextAnswer(request: { answers: Array<{ Content?: string }> }): boolean {
    const userEntry = request.answers.find((a) => a.Content != null)
    if (!userEntry) {
      return false
    }
    const normalizedUser = this.normalizeKeyboardAnswer(userEntry.Content)
    if (!normalizedUser) {
      return false
    }
    const userKey = normalizedUser.toLowerCase()
    const referenceKeys = this.question.Question.Answers.map((a) =>
      this.normalizeKeyboardAnswer(a.Content)
    )
      .filter((ref): ref is string => ref != null && ref !== '')
      .map((ref) => ref.toLowerCase())
    return referenceKeys.includes(userKey)
  }
}
