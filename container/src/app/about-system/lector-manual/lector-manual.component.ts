import { Component, Input, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { first } from 'rxjs/operators'
import { AuthenticationService } from 'src/app/core/services/auth.service'

@Component({
  templateUrl: './lector-manual.component.html',
  styleUrls: ['./lector-manual.component.less'],
  selector: 'app-lector-manual',
})
export class LectorManualComponent implements OnInit {
  loginForm: FormGroup
  loading = false
  submitted = false
  returnUrl: string
  hide = true

  isTeacher: boolean
  isStudent: boolean

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private autService: AuthenticationService
  ) {}

  panelOpenState = false

  ngOnInit() {
    this.isTeacher = this.autService.currentUserValue.role == 'lector'
    this.isStudent = this.autService.currentUserValue.role == 'student'
  }

  get f() {
    return this.loginForm.controls
  }

  routeBack() {
    this.router.navigate(['/'])
  }
}
