import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Professor, EditProfessor } from 'src/app/model/professor';
import { GroupService } from 'src/app/service/group.service';
import { Group } from 'src/app/model/group';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

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
      Surname: new FormControl(professor.LastName, [Validators.required, Validators.maxLength(50)]),
      Name: new FormControl(professor.FirstName, [Validators.required, Validators.maxLength(50)]),
      Patronymic: new FormControl(professor.MiddleName, [Validators.maxLength(50)]),
      SkypeContact: new FormControl(professor.SkypeContact || '', [Validators.maxLength(50)]),
      Phone: new FormControl(professor.Phone || '', [Validators.maxLength(50)]),
      Skill: new FormControl(professor.Skill || '', [Validators.maxLength(255)]),
      About: new FormControl(professor.About || '', [Validators.maxLength(255)]),
      IsSecretary: new FormControl(professor.IsSecretary),
      IsLectureHasGraduateStudents: new FormControl(professor.IsLectureHasGraduateStudents),
      Groups: new FormControl(professor.Groups),
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
    const prof = this.data;
    const object = new EditProfessor();
    // object.LecturerId = prof.Id;
    // object.Avatar = prof.Avatar || '';
    // object.SkypeContact = prof.SkypeContact || '';
    // object.Phone = prof.Phone || '';
    // object.Skill = prof.Skill || '';
    // object.About = prof.About || '';
    // object.Name = this.form.controls.Name.value || '';
    // object.Surname = this.form.controls.Surname.value || '';
    // object.Patronymic = this.form.controls.Patronymic.value || '';
    // object.Username = prof.Login || '';
    // object.Email = prof.Email || '';
    // object.IsActive = prof.IsActive || '';
    // object.IsSecretary = this.form.controls.IsSecretary.value || '';
    // object.IsLecturerHasGraduateStudents = this.form.controls.IsLectureHasGraduateStudents.value || true;
    // object.SeletectedGroupIds = this.form.controls.Groups.value.map( (item) => item.Id) || [];
    object.LecturerId = prof.Id;
    object.Avatar = '123';
    object.SkypeContact = '123';
    object.Phone = '123';
    object.Skill = '123';
    object.About = '123';
    object.Name = '12334';
    object.Surname = '232';
    object.Patronymic = '34533';
    object.Username = '43543353';
    object.Email = '54353';
    object.IsActive = prof.IsActive || false;
    object.IsSecretary = this.form.controls.IsSecretary.value || false;
    object.IsLecturerHasGraduateStudents = this.form.controls.IsLectureHasGraduateStudents.value || false;
    object.SeletectedGroupIds = this.form.controls.Groups.value.map((item) => item.Id) || [];
    return object;
  }
}
