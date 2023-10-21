import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { TestService } from '../service/test.service'
import { Question } from '../models/question/question.model'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog, MatSnackBar } from '@angular/material'
import { QuestionPopupComponent } from './components/question-popup/question-popup.component'
import { Test } from '../models/test.model'
import { QuestionOtherTestComponent } from './components/question-other-test/question-other-test.component'
import { AutoUnsubscribe } from '../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../core/auto-unsubscribe-base'
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject, throwError } from 'rxjs'
import { DeleteQuestionConfirmationPopupComponent } from './components/delete-question-confirmation-popup/delete-question-confirmation-popup.component'
import { NeuralNetworkPopupComponent } from './components/neural-network-popup/neural-network-popup.component'
import { TranslatePipe } from 'educats-translate'
import { AppToastrService } from '../service/toastr.service'

@AutoUnsubscribe
@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.less'],
})
export class QuestionsPageComponent
  extends AutoUnsubscribeBase
  implements OnInit
{
  public questions: Question[]
  public questionsDefault: Question[]
  public test: Test
  public testId: string
  private unsubscribeStream$: Subject<void> = new Subject<void>()
  private isEUMKTest: boolean

  constructor(
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router,
    private translatePipe: TranslatePipe,
    private snackBar: MatSnackBar,
    private toastr: AppToastrService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    super()
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id')
    this.testService
      .getTestById(this.testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test: Test) => {
        this.test = test
        this.isEUMKTest =
          test && (test.BeforeEUMK || test.ForEUMK || test.ForNN)
      })
    this.loadQuestions().pipe(takeUntil(this.unsubscribeStream$)).subscribe()
  }

  public loadQuestions(): Observable<Question[]> {
    return this.testService.getQuestionsByTest(this.testId).pipe(
      tap((questions) => {
        this.questions = questions
        this.questionsDefault = questions
      })
    )
  }

  public deleteQuestion(event): void {
    this.testService
      .deleteQuestion(event)
      .pipe(
        switchMap(() => this.loadQuestions()),
        takeUntil(this.unsubscribeStream$),
        catchError(() => {
          this.toastr.addErrorFlashMessage(
            this.translatePipe.transform(
              'text.test.cant.delete.question',
              'Не удалось удалить вопрос'
            )
          )
          return throwError(null)
        })
      )
      .subscribe()
    this.cdr.detectChanges()
  }

  public openConfirmationDialog(event: any): void {
    const dialogRef = this.dialog.open(
      DeleteQuestionConfirmationPopupComponent,
      {
        width: '500px',
        data: { event },
        panelClass: 'test-modal-container',
      }
    )

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result) => {
        if (result) {
          this.deleteQuestion(event)
        }
      })
  }

  public createNeuralNetwork(): void {
    const dialogRef = this.dialog.open(NeuralNetworkPopupComponent, {
      data: { questions: this.questions, testId: this.testId },
    })

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribeStream$)).subscribe()
  }

  public addQuestionFromOtherTest(event): void {
    const dialogRef = this.dialog.open(QuestionOtherTestComponent, {
      width: '700px',
      data: { event, test: this.testId, name: this.test.Title },
      autoFocus: false,
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result) => {
        if (result) {
          this.loadQuestions()
            .pipe(takeUntil(this.unsubscribeStream$))
            .subscribe()
        }
      })
  }

  public filterQuestions(event): void {
    this.questions = JSON.parse(JSON.stringify(this.questionsDefault))
    this.questions = this.questions.filter((question) =>
      question.Title.includes(event)
    )
  }

  public addNewQuestion(event): void {
    const dialogRef = this.dialog.open(QuestionPopupComponent, {
      data: {
        event,
        title: this.test.Title,
        test: this.testId,
        questionLength: this.questions.length,
        isEUMKTest: this.isEUMKTest,
      },
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result) => {
        if (result) {
          this.loadQuestions()
            .pipe(takeUntil(this.unsubscribeStream$))
            .subscribe()
        }
      })
  }

  public navigate(): void {
    this.router.navigate(['test-control'])
  }
}
