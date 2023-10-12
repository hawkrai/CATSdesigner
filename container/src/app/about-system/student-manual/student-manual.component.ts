import { Component, Input, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { first } from 'rxjs/operators'
import { AuthenticationService } from 'src/app/core/services/auth.service'

@Component({
  templateUrl: './student-manual.component.html',
  styleUrls: ['./student-manual.component.less'],
  selector: 'app-student-manual',
})
export class StudentManualComponent implements OnInit {
  loginForm: FormGroup
  loading = false
  submitted = false
  returnUrl: string
  hide = true

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  panelOpenState = false

  ngOnInit() {}

  get f() {
    return this.loginForm.controls
  }

  /*onSubmit() {
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
  routeToLogin() {
    this.router.navigate(['/']);
    }*/
}
