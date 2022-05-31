import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Group } from 'src/app/model/group';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {

  form: FormGroup;
  date: Date;
  group: Group;
  groupNameSymbols ='А-Яа-яA-Za-z0-9ёЁіІ _-,.';
  @Output() submitEM = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<object>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.date = new Date();
    this.group = this.data;
    const nameRegExp = '^[А-Яа-яA-Za-z0-9ёЁіІ _-,.]*$';
    if(this.data.Name == null){
      this.data = new Group();
      this.group.Name;
      this.data.StartYear = this.date.getFullYear().toString();
      this.data.GraduationYear = (this.date.getFullYear() + 4).toString();
    }
    console.log(this.data);
    this.form = this.formBuilder.group({
      Name: new FormControl(this.group.Name, [Validators.required, Validators.pattern('^[0-9a-zA-ZА-Яа-я .,_-]*$'), Validators.maxLength(10)]),
      StartYear: new FormControl(Number.parseInt(this.data.StartYear)),
      GraduationYear: new FormControl(Number.parseInt(this.data.GraduationYear))
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({data: this.sendData()});
  }

  yearOfIssue() {
    var range = 40;
    const yearArr = new Array();
    let currentYear = this.date.getFullYear() - range/2;
    for (let i = 0; i < range; i++) {
      yearArr.push(currentYear);
      currentYear++;
    }
    return yearArr;
  } 

  yearOfGraduation() {
    const yearArr = new Array();
    if(this.form.controls.StartYear.value){
      var range = 10;
    let currentYear = this.form.controls.StartYear.value;
    for (let i = 0; i < range; i++) {
      yearArr.push(currentYear);
      currentYear++;
    }
    }
    
    return yearArr;
  }

  trimFields() {
    if (this.data.Name != null) {
      this.data.Name = this.data.Name.trim();
    }
  }

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  sendData() {
    const group = this.data;
    group.Name = this.form.controls.Name.value;
    group.GraduationYear = this.form.controls.GraduationYear.value;
    group.StartYear = this.form.controls.StartYear.value;
    return group;
  }
}
