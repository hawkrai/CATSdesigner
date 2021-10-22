import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditProfessor } from 'src/app/model/professor';
import { GroupService } from 'src/app/service/group.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-lector',
  templateUrl: './edit-lector.component.html',
  styleUrls: ['./edit-lector.component.css']
})
export class EditLectorComponent implements OnInit {

  groups: any;
  @Output() submitEM = new EventEmitter();
  form: FormGroup;
  isLoad = false;

  constructor(
    private formBuilder: FormBuilder,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<EditLectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const professor = this.data;
    this.loadGroup();
    var nameRegExp = '^[А-Яа-яA-Za-z0-9ёЁіІ _-]*$';
    this.form = this.formBuilder.group({
      Name: new FormControl(professor.FirstName, [Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Surname: new FormControl(professor.LastName, [Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Patronymic: new FormControl(professor.MiddleName, [Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Email: new FormControl(professor.Email || '',
[Validators.pattern('^[a-z0-9_.@-]{3,30}$'), Validators.maxLength(30)]),
      SkypeContact: new FormControl(professor.SkypeContact || '', [Validators.maxLength(50)]),
      Phone: new FormControl(professor.Phone || '', [Validators.maxLength(50)]),
      Skill: new FormControl(professor.Skill || '', [Validators.maxLength(250)]),
      About: new FormControl(professor.About || '', [Validators.maxLength(255)]),
      IsSecretary: new FormControl(professor.IsSecretary),
      IsLecturerHasGraduateStudents: new FormControl(professor.IsLectureHasGraduateStudents),
      Groups: new FormControl(professor.Groups)
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
      this.isLoad = true;
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
    const object = new EditProfessor();
    const professor = this.data;
    object.Name = this.form.controls.Name.value;
    object.Surname = this.form.controls.Surname.value;
    object.Patronymic = this.form.controls.Patronymic.value || '';
    object.UserName = professor.Login;
    object.IsActive = professor.IsActive !== 'Удален';
    object.Email = this.form.controls.Email.value;
    object.SeletectedGroupIds = this.form.controls.Groups.value || [];
    object.Groups = this.form.controls.Groups.value || [];
    object.LecturerId = professor.Id;
    object.IsSecretary = this.form.controls.IsSecretary.value || false;
    object.IsLecturerHasGraduateStudents = this.form.controls.IsLecturerHasGraduateStudents.value || false;
    object.About = this.form.controls.About.value || '';

    object.Avatar = professor.Avatar || '';
    object.SkypeContact = this.form.controls.SkypeContact.value || '';
    object.Phone = '+ 375' + this.form.controls.Phone.value || '';
    object.Skill = this.form.controls.Skill.value || '';
    return object;
  }
}
