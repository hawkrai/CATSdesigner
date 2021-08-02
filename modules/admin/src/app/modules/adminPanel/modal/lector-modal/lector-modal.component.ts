import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Professor, EditProfessor, AddProfessor} from 'src/app/model/professor';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MustMatch } from 'src/app/shared/MustMatch';
import {ValidateEmailNotTaken} from '../../../../shared/ValidateEmailNotTaken';
import {AccountService} from '../../../../service/account.service';
import {questions} from '../../../../shared/questions';
import {GroupService} from '../../../../service/group.service';

@Component({
  selector: 'app-lector-modal',
  templateUrl: './lector-modal.component.html',
  styleUrls: ['./lector-modal.component.css']
})
export class LectorModalComponent implements OnInit {

  form: FormGroup;
  @Output() submitEM = new EventEmitter();
  quest = questions;
  groups;
  isLoad;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LectorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Professor,
    private accountService: AccountService, private groupService: GroupService) { }

  ngOnInit(): void {
    const professor = this.data;

    this.form = this.formBuilder.group({
      Username: new FormControl( professor.Username,
        [Validators.required, Validators.minLength(3),
          Validators.pattern('^[A-Za-z0-9_.-@]*$')], ValidateEmailNotTaken.createValidator(this.accountService)),
      Password: new FormControl( professor.Password,
        [Validators.required, Validators.minLength(6), Validators.pattern('^[A-Za-z0-9_]*$'),
        Validators.maxLength(30), this.passwordValidator]),
      ConfirmPassword: new FormControl(professor.ConfirmPassword),
      Surname: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern('^[А-Яа-яA-Za-z0-9ёЁ _-]*$')]),
      Name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30),
        Validators.pattern('^[А-Яа-яA-Za-z0-9ёЁ _-]*$')]),
      Patronymic: new FormControl('', [Validators.maxLength(30),
        Validators.pattern('^[А-Яа-яA-Za-z0-9ёЁ _-]*$')]),
      IsSecretary: new FormControl(false),
      IsLecturerHasGraduateStudents: new FormControl(false)
    }, {
      validator: MustMatch('Password', 'ConfirmPassword')
    });
    this.getGroups();
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

  getGroups() {
    this.groupService.getGroups().subscribe(items => {
      this.groups = items;
      this.isLoad = true;
    });
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
    const object = new AddProfessor();
    object.UserName = this.form.controls.Username.value;
    object.Password = this.form.controls.Password.value;
    object.ConfirmPassword = this.form.controls.ConfirmPassword.value;
    object.Surname = this.form.controls.Surname.value;
    object.Name = this.form.controls.Name.value || '';
    object.Patronymic = this.form.controls.Patronymic.value || '';
    object.IsSecretary = this.form.controls.IsSecretary.value;
    object.IsLecturerHasGraduateStudents = this.form.controls.IsLecturerHasGraduateStudents.value;
    return object;
  }
}
