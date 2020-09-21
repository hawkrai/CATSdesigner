import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {TestService} from "../service/test.service";
import {Question} from "../models/question/question.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {QuestionPopupComponent} from "./components/question-popup/question-popup.component";
import {Test} from "../models/test.model";
import {QuestionOtherTestComponent} from "./components/question-other-test/question-other-test.component";
import {AutoUnsubscribe} from "../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../core/auto-unsubscribe-base";
import {catchError, takeUntil} from "rxjs/operators";
import {Subject, throwError} from "rxjs";
import {DeleteQuestionConfirmationPopupComponent} from "./components/delete-question-confirmation-popup/delete-question-confirmation-popup.component";


@AutoUnsubscribe
@Component({
  selector: "app-questions-page",
  templateUrl: "./questions-page.component.html",
  styleUrls: ["./questions-page.component.less"]
})
export class QuestionsPageComponent extends AutoUnsubscribeBase implements OnInit {

  public questions: Question[];
  public questionsDefault: Question[];
  public test: Test;
  public testId: string;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testService: TestService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef,
              public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get("id");
    this.testService.getTestById(this.testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test: Test) => {
        console.log("this.test " + this.test);
        this.test = test;
      });
    this.loadQuestions();
  }

  public loadQuestions(): void {
    this.testService.getQuestionsByTest(this.testId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((questions) => {
        this.questions = questions;
        this.questionsDefault = questions;
      });
  }

  public deleteQuestion(event): void {
    this.testService.deleteQuestion(event)
      .pipe(takeUntil(this.unsubscribeStream$),
        catchError(() => {
          this.openSnackBar("Не удалось удалить вопрос");
          return throwError(null);
        }))
      .subscribe();
    this.loadQuestions();
    this.cdr.detectChanges();
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public openConfirmationDialog(event: any): void {
    const dialogRef = this.dialog.open(DeleteQuestionConfirmationPopupComponent, {
      width: "500px",
      data: {event}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(result => {
        if (result) {
          this.deleteQuestion(event);
        }
      });
  }

  public openPopup(event): void {
    const title = this.test.Title;
    const dialogRef = this.dialog.open(QuestionPopupComponent, {
      width: "700px",
      data: {event, title, test: this.testId},
      autoFocus: false,
      maxHeight: "100vh"
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(result => {
        if (result) {
          this.loadQuestions();
        }
      });
  }

  public addQuestionFromOtherTest(event): void {
    const dialogRef = this.dialog.open(QuestionOtherTestComponent, {
      width: "700px",
      data: {event, test: this.testId},
      autoFocus: false,
      maxHeight: "90vh"
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(result => {
        if (result) {
          this.loadQuestions();
        }
      });
  }

  public filterQuestions(event): void {
    this.questions = (JSON.parse(JSON.stringify(this.questionsDefault)));
    this.questions = this.questions.filter(question => question.Title.includes(event));
  }

  public addNewQuestion(): void {
    this.openPopup(null);
  }

  public navigate(): void {
    this.router.navigate(["test-control"]);
  }
}
