import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  templateUrl: './about-system.component.html',
  styleUrls: ['./about-system.component.less'],
  selector: 'app-about-system'
})
export class AboutSystemComponent implements OnInit {
  isStudent: boolean;
  isTeacher: boolean;

  constructor(
    private autService: AuthenticationService
  ) {}

  ngOnInit() {

    this.isTeacher = this.autService.currentUserValue.role == "lector";
    this.isStudent = this.autService.currentUserValue.role == "student";
  }
}
