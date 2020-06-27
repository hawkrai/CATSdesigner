import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SearchGroupComponent } from '../control/modal/search-group/search-group.component';
import { StudentService } from '../service/student.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import {AccountService} from '../service/account.service';
import {Router} from '@angular/router';
import {MessageComponent} from "../component/message/message.component";

enum Role {
  ADMIN = 'admin',
  STUDENT = 'student'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() submitEM = new EventEmitter();
  form: FormGroup;
  result: string;

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  constructor(private studentService: StudentService, private accountService: AccountService, private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      password: new FormControl('' , [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
    });
  }

  openControlGroupDialog() {
    this.dialog.open(SearchGroupComponent);
  }

  changePassword() {
    this.dialog.open(ChangePasswordComponent);
  }

  login() {
    this.accountService.login(this.form.controls.username.value, this.form.controls.password.value).subscribe(
      res => {
        if ( Role.ADMIN === res.role ) {
          this.router.navigate(['/admin/main']);
        } else {
          this.dialog.open(MessageComponent, {
            data: 'Вам не хватает прав.',
            position: {
              bottom: '0px',
              right: '0px'
            }
          });
        }
      },
      () => {
        this.dialog.open(MessageComponent, {
          data: 'Произошла ошибка при входе. Попробуйте заново. ',
          position: {
            bottom: '0px',
            right: '0px'
          }
        });
      }
    );
  }

}
