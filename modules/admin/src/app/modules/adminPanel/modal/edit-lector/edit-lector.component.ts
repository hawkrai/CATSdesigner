import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditProfessor, Professor } from 'src/app/model/professor';
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
  professor : Professor;

  constructor(
    private formBuilder: FormBuilder,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<EditLectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.loadGroup();
    this.professor = this.data;
    var nameRegExp = '^[А-Яа-яA-Za-z0-9ёЁіІ _-]*$';
    this.form = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Surname: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Patronymic: new FormControl('', [Validators.maxLength(30),
        Validators.pattern(nameRegExp)]),
      Email: new FormControl(this.professor.Email || '',
[Validators.pattern('^[a-z0-9_.@-]{3,30}$'), Validators.maxLength(30)]),
      SkypeContact: new FormControl(this.professor.SkypeContact || '', [Validators.maxLength(50)]),
      Phone: new FormControl(this.professor.Phone || '', [Validators.maxLength(50)]),
      Skill: new FormControl(this.professor.Skill || '', [Validators.maxLength(250)]),
      About: new FormControl(this.professor.About || '', [Validators.maxLength(255)]),
      IsSecretary: new FormControl(this.professor.IsSecretary),
      IsLecturerHasGraduateStudents: new FormControl(this.professor.IsLecturerHasGraduateStudents),
      Groups: new FormControl(this.professor.Groups)
    });
  }

  trimFields() {
    if(this.professor.FirstName != null){
    this.professor.FirstName = this.professor.FirstName.trim();
    }
    if(this.professor.LastName != null){
    this.professor.LastName = this.professor.LastName.trim();
    }
    if(this.professor.MiddleName != null){
    this.professor.MiddleName = this.professor.MiddleName.trim();
    }
    if(this.professor.Email != null){
    this.professor.Email = this.professor.Email.trim();
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
