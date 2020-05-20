import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';
import { MustMatch } from './MustMatch';
import { questions } from '../questions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @Output() submitEM = new EventEmitter();

  quest = questions;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.form = this.formBuilder.group({
        username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-z0-9_-]{3,30}$')]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30), this.passwordValidator]),
        confirmPassword: new FormControl(''),
        surname: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
        name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
        patronymic: new FormControl(''),
        groupNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
        secret: new FormControl('')
      }, {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  yearOfReceipt() {
    const yearArr = new Array();
    let currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      yearArr.push(currentYear);
      currentYear--;
    }
    return yearArr;
  }

  private passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value;
    /** Проверка на содержание цифр */
    const hasNumber = /[0-9]/.test(value);
    /** Проверка на содержание заглавных букв */
    const hasCapitalLetter = /[A-Z]/.test(value);
    /** Проверка на содержание прописных букв */
    const hasLowercaseLetter = /[a-z]/.test(value);
   /** Общая проверка */
    const passwordValid = hasNumber && hasCapitalLetter && hasLowercaseLetter;
    if (!passwordValid) {
     return {invalid: 'Password unvalid'};
    }
    return null;
   }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

}
