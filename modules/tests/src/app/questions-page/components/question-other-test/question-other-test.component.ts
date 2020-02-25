import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Test} from "../../../models/test.model";


@Component({
  selector: 'app-question-other-test',
  templateUrl: './question-other-test.component.html',
  styleUrls: ['./question-other-test.component.less']
})
export class QuestionOtherTestComponent implements OnInit {
  public tests: Test[];

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
    this.dialogRef.close();
  }
}
