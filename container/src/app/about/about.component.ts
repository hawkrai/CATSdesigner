import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { first } from 'rxjs/operators'
import { AuthenticationService } from '../core/services/auth.service'
import { MatButtonModule } from '@angular/material/button'
import { Locale } from '../shared/interfaces/locale.interface'

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less'],
})
export class AboutComponent implements OnInit {
  loginForm: FormGroup
  loading = false
  submitted = false
  returnUrl: string
  hide = true

  public locales: Locale[] = [
    { name: 'Ru', value: 'ru' },
    { name: 'En', value: 'en' },
  ]
  public locale: Locale

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    })
    const local: string = localStorage.getItem('locale')
    this.locale = local
      ? this.locales.find((locale: Locale) => locale.value === local)
      : this.locales[0]
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/'
  }

  get f() {
    return this.loginForm.controls
  }

  onSubmit() {
    this.submitted = true

    if (this.loginForm.invalid) {
      this.submitted = false
      return
    }

    this.loading = true
    this.authenticationService
      .login(this.f.userName.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl])
        },
        (error) => {
          this.loading = false
        }
      )
  }
  routeToLogin() {
    this.router.navigate(['/'])
  }
  public onValueChange(value: any): void {
    localStorage.setItem('locale', value.value.value)
    window.location.reload()
  }
}
