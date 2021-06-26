import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  templateUrl: './about-system.component.html',
  styleUrls: ['./about-system.component.less']
})
export class AboutSystemComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide=true;

  isStudent: boolean;
  isTeacher: boolean;

  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private autService: AuthenticationService
    ) {
        
    }

  ngOnInit() {

    this.isTeacher = this.autService.currentUserValue.role == "lector";
      this.isStudent = this.autService.currentUserValue.role == "student";
  }

  get f() { return this.loginForm.controls; }

}
