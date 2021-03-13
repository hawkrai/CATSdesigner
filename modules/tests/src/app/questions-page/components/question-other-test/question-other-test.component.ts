import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Test} from "../../../models/test.model";
import {Question} from "../../../models/question/question.model";
import {takeUntil, tap} from "rxjs/operators";
import {AutoUnsubscribe} from "../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";


@AutoUnsubscribe
@Component({
  selector: "app-question-other-test",
  templateUrl: "./question-other-test.component.html",
  styleUrls: ["./question-other-test.component.less"]
})
export class QuestionOtherTestComponent extends AutoUnsubscribeBase implements OnInit {
  public tests: Test[];
  public testId: number | string;
  public questions: Question[];
  public filteredQuestions: Question[];
  public chosenQuestions: { [key: string]: string } = {};
  public request: Question = new Question();
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<QuestionOtherTestComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testService: TestService) {
    super();
  }

  ngOnInit() {
    this.testService.getTestForLector()
      .pipe(
        tap((tests: Test[]) => {
          tests.forEach((test) => {
            let sliced = test.Title.slice(0, 80);
            if (sliced.length < test.Title.length) {
              sliced += "...";
            }
            test.tooltipTitle = sliced;
          });
          this.tests = tests;
        }),
        takeUntil(this.unsubscribeStream$))
      .subscribe();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.request.testId = <string>this.data.test;
    this.request.questionItems = [];
    Object.keys(this.chosenQuestions).forEach(value => {
      if (this.chosenQuestions[value])
        this.request.questionItems.push(Number(value));
    });
    this.testService.AddQuestionsFromAnotherTest(this.request)
      .pipe(
        tap(() => this.dialogRef.close(true)),
        takeUntil(this.unsubscribeStream$)
      ).subscribe();
  }

  public onValueChange(event): void {
    console.log(event);
    this.testService.getQuestionsFromOtherTest(event.value)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(questions => {
        questions.forEach((question) => {
          var sliced = question.Title.slice(0, 80);
          if (sliced.length < question.Title.length) {
            sliced += "...";
          }
          question.tooltipTitle = sliced;
        });

        this.questions = questions;
        this.filteredQuestions = questions;
      });
  }

  public filterQuestions(event): void {
    this.filteredQuestions = this.questions.filter((question) => question.Title.toLowerCase().includes(event.target.value.toLowerCase()));
  }
}
