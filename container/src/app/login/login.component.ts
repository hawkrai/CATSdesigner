import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../core/services/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide=true;

  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        userName: new FormControl('', [Validators.required, Validators.minLength(3),Validators.maxLength(30),
          Validators.pattern('^[A-Za-z0-9_.-]{3,30}$')]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
          Validators.pattern('^[A-Za-z0-9_]{6,30}$'), this.passwordValidator]),
    });    
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
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {                
                this.loading = false;
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
}
