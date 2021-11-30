import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../core/services/auth.service';
import {TranslatePipe} from 'educats-translate';
import {MatDialog} from '@angular/material/dialog';
import {VideoComponent} from './modal/video.component';
import { ViewEncapsulation } from '@angular/core';
import { AppToastrService } from '../core/services/toastr.service';
import { HttpErrorResponse } from '@angular/common/http';

interface Locale {
  name: string;
  value: string
}

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide=true;
  public locales: Locale[] = [{name: "Ru", value: "ru"}, {name: "En", value: "en"}];
  public locale: Locale;

  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private authenticationService: AuthenticationService,
        private toastr: AppToastrService,
         private translatePipe: TranslatePipe
    ) {
        
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        userName: new FormControl('', [Validators.required, Validators.minLength(3),Validators.maxLength(30),
          Validators.pattern('^[A-Za-z0-9_.-@]{3,30}$')]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
          Validators.pattern('^[A-Za-z0-9_-]{6,30}$'), this.passwordValidator]),
    });    
    const local: string = localStorage.getItem("locale");
    this.locale = local ? this.locales.find((locale: Locale) => locale.value === local) : this.locales[0];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
        this.submitted = false;
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.userName.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            (data) => {
                this.router.navigate([this.returnUrl]);
            },
            (error : HttpErrorResponse) => {
                this.loading = false;
                this.submitted = false; 
                if(error.message.includes("User hasn't verified yet!")){
                  this.toastr.addWarningFlashMessage(this.translatePipe.transform('text.login.NotVerified', "Ваш аккаунт не подтвержден. Обратитесь к преподавателю для подтверждения аккаунта!"))
                }       
                else{
                  this.toastr.addErrorFlashMessage(this.translatePipe.transform('text.login.WrongData', "Неверный логин и (или) пароль!"))
                }
            

            });
  }

  private passwordValidator(control: FormControl): ValidationErrors {    
    return null;
   }

   hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && control.touched;
  }

  public onValueChange(value: any): void {
    localStorage.setItem("locale", value.value.value);
    window.location.reload()
  }

  public open() {
    const dialogRef = this.dialog.open(VideoComponent);
  }

}
