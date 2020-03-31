import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Test} from "../../../models/test.model";
import {Question} from "../../../models/question/question.model";
import {tap} from "rxjs/operators";


@Component({
  selector: 'app-question-other-test',
  templateUrl: './question-other-test.component.html',
  styleUrls: ['./question-other-test.component.less']
})
export class QuestionOtherTestComponent implements OnInit {
  public tests: Test[];
  public testId: number | string;
  public questions: Question[];
  public chosenQuestions: { [key: string]: string } = {};
  public request: Question = new Question();

  constructor(public dialogRef: MatDialogRef<QuestionOtherTestComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testService: TestService) {
  }

  ngOnInit() {
    this.testService.getTestForLector().subscribe((tests) => {
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
        tap(() => this.dialogRef.close(true))
      ).subscribe();
  }

  public onValueChange(event): void {
    console.log(event);
    this.testId = event.value;
    this.testService.getQuestionsFromOtherTest(event.value).subscribe(questions => {
      this.questions = questions;
    });
  }
}
