import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { Group } from 'src/app/model/group';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GroupService } from 'src/app/service/group.service';
import { EditStudent, Student } from 'src/app/model/student';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  groups: Group[];
  form: FormGroup;
  student: Student;
  @Output() submitEM = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<EditStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.loadGroup();
    this.student = this.data;
    var nameRegExp = '^[А-Яа-яA-Za-z0-9ёЁіІ _-]*$';
    this.form = this.formBuilder.group({
      Surname: new FormControl(this.student.Surname, [Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Name: new FormControl(this.student.Name, [Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Patronymic: new FormControl(this.student.Patronymic, [Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Group: new FormControl(this.student.GroupId),
    });
     console.log(this.data);
  }

  trimFields() {
    if(this.student.Name != null){
    this.student.Name = this.student.Name.replace(/\s/g, "");
    }
    if(this.student.Surname != null){
    this.student.Surname = this.student.Surname.replace(/\s/g, "");
    }
    if(this.student.Patronymic != null){
    this.student.Patronymic= this.student.Patronymic.replace(/\s/g, "");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({data: this.sendData()});
  }

  loadGroup() {
    return this.groupService.getGroups().subscribe( items => {
      this.groups = items;
    });
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
    const object = new EditStudent();
    object.Avatar = null;
    object.Name = this.form.controls.Name.value;
    object.Surname = this.form.controls.Surname.value;
    object.Patronymic = this.form.controls.Patronymic.value;
    object.UserName = this.data.UserName;
    object.Group = this.form.controls.Group.value;
    object.Email = this.data.Email || '';
    object.IsActive = this.data.IsActive;
    object.Id = this.data.Id;
    object.SkypeContact = this.data.SkypeContact || '';
    object.Phone = this.data.Phone || '';
    object.About = this.data.About || '';
    return object;
  }
}
