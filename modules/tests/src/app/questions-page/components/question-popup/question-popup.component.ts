import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Question} from "../../../models/question/question.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-question-popup',
  templateUrl: './question-popup.component.html',
  styleUrls: ['./question-popup.component.less']
})
export class QuestionPopupComponent implements OnInit {

  public question: Question;

  form: FormGroup;

  public readonly ANSWER_TYPES: any = [{id: 0, label: "С одним вариантом"},
    {id: 1, label: "С несколькими вариантами"},
    {id: 2, label: "Ввод с клавиатуры"},
    {id: 3, label: "Последовательность элементов"}];

  constructor(public dialogRef: MatDialogRef<QuestionPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testService: TestService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
    this.testService.getQuestion(this.data.event).subscribe((question) => {
      this.question = question;
      //this.form.controls['signature'].value = question.Description;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChange(event) {
    console.log('changed');
  }

  onBlur(event) {
    console.log('blur ' + event);
  }

  onChange2(event) {
    console.warn(this.form.value);
  }

  public addAnswer(): void {

  }

  public onValueChange(event): void {

  }
}
