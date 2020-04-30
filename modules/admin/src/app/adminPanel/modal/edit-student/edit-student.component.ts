import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { Group } from 'src/app/model/group';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GroupService } from 'src/app/service/group.service';

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
      Surname: new FormControl(student.Surname),
      Name: new FormControl(student.Name),
      Patronymic: new FormControl(student.Patronymic),
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

  sendData() {
    const st = this.data;
    st.FullName = this.form.controls.Surname.value + ' ' + this.form.controls.Name.value + ' '
     + this.form.controls.Patronymic.value;
    st.Surname = this.form.controls.Surname.value;
    st.Name = this.form.controls.Name.value;
    st.Patronymic = this.form.controls.Patronymic.value;
    st.Group = this.form.controls.Group.value.Name;
    return st;
  }
}
