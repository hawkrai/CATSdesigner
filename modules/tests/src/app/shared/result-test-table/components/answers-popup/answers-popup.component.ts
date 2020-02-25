import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestPassingService} from "../../../../service/test-passing.service";
import {UserAnswers} from "../../../../models/user-answers.model";


@Component({
  selector: 'app-answers-popup',
  templateUrl: './answers-popup.component.html',
  styleUrls: ['./answers-popup.component.less']
})
export class AnswersPopupComponent implements OnInit {

  public answers: UserAnswers[];

  constructor(public dialogRef: MatDialogRef<AnswersPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testPassingService: TestPassingService) {
  }

  ngOnInit() {
    this.testPassingService.getAnswersByStudentAndTest(this.data.id, this.data.event).subscribe((answers) => {
      this.answers = answers;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
