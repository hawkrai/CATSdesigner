import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Professor, EditProfessor } from 'src/app/model/professor';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MustMatch } from 'src/app/signup/MustMatch';

@Component({
  selector: 'app-lector-modal',
  templateUrl: './lector-modal.component.html',
  styleUrls: ['./lector-modal.component.css']
})
export class LectorModalComponent implements OnInit {

  form: FormGroup;
  @Output() submitEM = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LectorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Professor) { }

  ngOnInit(): void {
    const professor = this.data;

    console.log(this.data);

    this.form = this.formBuilder.group({
      Username: new FormControl( professor.Username,
        [Validators.required, Validators.minLength(6), Validators.pattern('^[a-z0-9_-]{3,30}$')]),
      Password: new FormControl( professor.Password,
        [Validators.required, Validators.minLength(6), Validators.maxLength(30), this.passwordValidator]),
      ConfirmPassword: new FormControl(professor.ConfirmPassword),
      Surname: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      Name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      Patronymic: new FormControl('', [Validators.maxLength(50)]),
      SkypeContact: new FormControl(professor.SkypeContact || '', [Validators.maxLength(50)]),
      Phone: new FormControl(professor.Phone || '', [Validators.maxLength(50)]),
      Skill: new FormControl(professor.Skill || '', [Validators.maxLength(255)]),
      About: new FormControl(professor.About || '', [Validators.maxLength(255)]),
      IsSecretary: new FormControl(false),
      IsLectureHasGraduateStudents: new FormControl(false),
      Groups: new FormControl(professor.Groups),
    }, {
      validator: MustMatch('Password', 'ConfirmPassword')
    });
  }

  private passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value;
    const hasNumber = /[0-9]/.test(value);
    const hasCapitalLetter = /[A-Z]/.test(value);
    const hasLowercaseLetter = /[a-z]/.test(value);
    const passwordValid = hasNumber && hasCapitalLetter && hasLowercaseLetter;
    if (!passwordValid) {
     return {invalid: 'Password unvalid'};
    }
    return null;
   }

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({data: this.sendData()});
  }

  sendData() {
    const object = new Professor();
    object.Username = this.form.controls.Username.value || '';
    object.Password = this.form.controls.Password.value || '';
    object.ConfirmPassword = this.form.controls.ConfirmPassword.value || '';
    object.Surname = this.form.controls.Surname.value || '';
    object.Email = this.form.controls.Surname.value || '';
    object.Name = this.form.controls.Name.value || '';
    object.Patronymic = this.form.controls.Patronymic.value || '';
    object.SkypeContact = this.form.controls.SkypeContact.value || '';
    object.Phone = this.form.controls.Phone.value || '';
    object.Skill = this.form.controls.Skill.value || '';
    object.About = this.form.controls.About.value || '';
    object.IsActive = true;
    object.IsSecretary = this.form.controls.IsSecretary.value;
    object.IsLecturerHasGraduateStudents = this.form.controls.IsLectureHasGraduateStudents.value;
    return object;
  }
}
