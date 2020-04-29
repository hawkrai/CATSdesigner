import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Professor } from 'src/app/model/professor';
import { GroupService } from 'src/app/service/group.service';
import { Group } from 'src/app/model/group';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-lector',
  templateUrl: './edit-lector.component.html',
  styleUrls: ['./edit-lector.component.css']
})
export class EditLectorComponent implements OnInit {

  groups: Group[];
  form: FormGroup;
  @Output() submitEM = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<EditLectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const professor = this.data;
    this.loadGroup();

    this.form = this.formBuilder.group({
      Id: new FormControl(professor.Id),
      Surname: new FormControl(professor.LastName),
      Name: new FormControl(professor.FirstName),
      Patronymic: new FormControl(professor.MiddleName),
      IsSecretary: new FormControl(professor.IsSecretary),
      IsLecturerHasGraduateStudents: new FormControl(professor.IsLecturerHasGraduateStudents),
      Groups: new FormControl(professor.Groups),
      FullName: new FormControl(professor.FullName)
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
    const prof = this.data;
    prof.FullName = this.form.controls.Surname.value + ' ' + this.form.controls.Name.value + ' ' + this.form.controls.Patronymic.value;
    prof.LastName = this.form.controls.Surname.value;
    prof.FirstName = this.form.controls.Name.value;
    prof.MiddleName = this.form.controls.Patronymic.value;
    prof.IsSecretary = this.form.controls.IsSecretary.value;
    prof.IsLecturerHasGraduateStudents = this.form.controls.IsLecturerHasGraduateStudents.value;
    prof.Groups = this.form.controls.Groups.value;
    return prof;
  }
}
