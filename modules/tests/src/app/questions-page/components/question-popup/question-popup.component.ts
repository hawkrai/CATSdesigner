import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Question} from "../../../models/question/question.model";


@Component({
  selector: 'app-question-popup',
  templateUrl: './question-popup.component.html',
  styleUrls: ['./question-popup.component.less']
})
export class QuestionPopupComponent implements OnInit {

  public question: Question;

  constructor(public dialogRef: MatDialogRef<QuestionPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testService: TestService) {
  }

  ngOnInit() {
    this.testService.getQuestion(this.data.event).subscribe((question) => {
      this.question = question;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
