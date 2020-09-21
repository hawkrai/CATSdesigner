import {Component, Inject, OnInit} from '@angular/core';
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
  selector: 'app-question-other-test',
  templateUrl: './question-other-test.component.html',
  styleUrls: ['./question-other-test.component.less']
})
export class QuestionOtherTestComponent extends AutoUnsubscribeBase implements OnInit {
  public tests: Test[];
  public testId: number | string;
  public questions: Question[];
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
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((tests) => {
      this.tests = tests;
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.request.testId = <string>this.testId;
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
    this.testId = event.value;
    this.testService.getQuestionsFromOtherTest(event.value)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(questions => {
      this.questions = questions;
    });
  }
}
