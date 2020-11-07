import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../shared/MustMatch';
import { questions } from '../../shared/questions';
import {AccountService} from '../../service/account.service';
import {RegisterModel} from '../../model/student';
import {GroupService} from '../../service/group.service';
import {MatDialog} from '@angular/material/dialog';
import {ValidateEmailNotTaken} from '../../shared/ValidateEmailNotTaken';
import {Router} from '@angular/router';
import {MessageComponent} from "../../component/message/message.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  @Output() submitEM = new EventEmitter();

  quest = questions;
  form: FormGroup;
  groups: any;
  isLoad = false;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService,
              private groupService: GroupService, private dialog: MatDialog,
              private route: Router) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
        Username: new FormControl('', [Validators.required, Validators.minLength(3),Validators.maxLength(30),
          Validators.pattern('^[A-Za-z0-9_.-]{3,30}$')], ValidateEmailNotTaken.createValidator(this.accountService)),
        Password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
          Validators.pattern('^[A-Za-z0-9_]{6,30}$'), this.passwordValidator]),
        ConfirmPassword: new FormControl(''),
        Surname: new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern('[^ ]*'), Validators.maxLength(30)]),
        Name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern('[^ ]*'), Validators.maxLength(30)]),
        Patronymic: new FormControl('', [Validators.pattern('[^ ]*'), Validators.maxLength(30)]),
        GroupId: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
        SecretId: new FormControl(1),
        SecretAnswer: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)])
      }, {
        validator: MustMatch('Password', 'ConfirmPassword')
      });
    this.getGroups();
  }

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  getGroups() {
    this.groupService.getGroups().subscribe(items => {
      this.groups = items;
      this.groups.sort((n1, n2) => n2.Name - n1.Name);
      this.isLoad = true;
    });
  }

  private passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value;
    const hasNumber = /[0-9]/.test(value);
    const hasCapitalLetter = /[A-Z]/.test(value);
    const hasLowercaseLetter = /[a-z]/.test(value);
    const passwordValid = hasNumber && hasCapitalLetter && hasLowercaseLetter;
    if (!passwordValid) {
     return {invalid: 'Password invalid'};
    }
    return null;
   }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  back(){
    window.parent.location.href = "/login";
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

  register() {
    const resultObject = new RegisterModel();
    const controls = this.form.controls;
    resultObject.Name = controls.Name.value;
    resultObject.Surname = controls.Surname.value;
    resultObject.Patronymic = controls.Patronymic.value;
    resultObject.UserName = controls.Username.value;
    resultObject.Password = controls.Password.value;
    resultObject.ConfirmPassword = controls.ConfirmPassword.value;
    resultObject.Group = controls.GroupId.value;
    resultObject.Answer = controls.SecretAnswer.value;
    resultObject.QuestionId = controls.SecretId.value;
    this.accountService.register(resultObject).subscribe(
      () => {
        this.dialog.open(MessageComponent, {
          data: 'Пользователь успешно зарегистрирован.',
          position: {
            bottom: '0px',
            right: '0px'
          }
        });
        this.route.navigate(['/login']);
      }, () => {
        this.dialog.open(MessageComponent, {
          data: 'Пользователь успешно зарегистрирован.',
          position: {
            bottom: '0px',
            right: '0px'
          }
        });
        window.parent.location.href = "/login";
      });
  }
}
