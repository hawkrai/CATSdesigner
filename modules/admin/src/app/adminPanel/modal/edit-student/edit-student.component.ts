import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { Group } from 'src/app/model/group';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GroupService } from 'src/app/service/group.service';
import { EditStudent } from 'src/app/model/student';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  groups: Group[];
  form: FormGroup;
  fullName: string;
  @Output() submitEM = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<object>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const student = this.data;
    this.loadGroup();
    this.form = this.formBuilder.group({
      Id: new FormControl(student.Id),
      Surname: new FormControl(student.Surname, [Validators.required, Validators.maxLength(100)]),
      Name: new FormControl(student.Name, [Validators.required, Validators.maxLength(100)]),
      Patronymic: new FormControl(student.Patronymic, [Validators.maxLength(100)]),
      Group: new FormControl(student.Group),
    });
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
    object.Id = this.data.Id;
    object.SkypeContact = this.data.SkypeContact || '';
    object.Phone = this.data.Phone || '';
    object.About = this.data.About || '';
    return object;
  }
}
