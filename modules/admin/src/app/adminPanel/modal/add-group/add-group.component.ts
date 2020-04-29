import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {

  form: FormGroup;
  @Output() submitEM = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<object>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const group = this.data.data;
    this.form = this.formBuilder.group({
      Name: new FormControl(group.Name),
      StartYear: new FormControl(group.StartYear),
      GraduationYear: new FormControl(group.GraduationYear)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({data: this.sendData()});
  }

  yearOfReceipt() {
    const yearArr = new Array();
    let currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      yearArr.push(currentYear);
      currentYear--;
    }
    return yearArr;
  }

  yearOfIssue() {
    const yearArr = new Array();
    let currentYear = new Date().getFullYear();
    for (let i = 0; i < 6; i++) {
      yearArr.push(currentYear);
      currentYear++;
    }
    return yearArr;
  }

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  sendData() {
    const group = this.data.data;
    group.Name = this.form.controls.Name.value;
    group.GraduationYear = this.form.controls.GraduationYear.value;
    group.StartYear = this.form.controls.StartYear.value;
    return group;
  }
}
