import { Component, OnInit, Output, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MustMatch } from '../../shared/MustMatch';
import { UserService } from '../../service/userService';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {ResetPasswordJson} from '../../model/resetPassword';
import {AccountService} from '../../service/account.service';
import {MessageComponent} from '../../component/message/message.component';
import { AppToastrService } from 'src/app/service/toastr.service';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.css']
})
export class ResetPasswordModalComponent implements OnInit {

  form: FormGroup;
  @Output() submitEM = new EventEmitter();
  constructor(private formBuilder: FormBuilder, private userService: UserService, private accountService: AccountService,
              private dialog: MatDialog, public dialogRef: MatDialogRef<ResetPasswordModalComponent>, private toastr: AppToastrService,
              @Inject(MAT_DIALOG_DATA) public data: string) {}

  ngOnInit() {
    console.log(this.data);
    this.form = this.formBuilder.group({
        password: new FormControl('' , [Validators.required, Validators.pattern('^[A-Za-z0-9_]*$'),
         Validators.minLength(6), Validators.maxLength(30), this.passwordValidator]),
        confirmPassword: new FormControl(''),
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  private passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value;
    const hasNumber = /[0-9]/.test(value);
    const hasCapitalLetter = /[A-Z]/.test(value);
    const hasLowercaseLetter = /[a-z]/.test(value);
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

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  resetPassword(resetPasswordModel) {
    this.accountService.resetPassword(resetPasswordModel).subscribe( () => {
      this.toastr.addSuccessFlashMessage('Студент успешно изменен!');
      window.parent.location.href = "/login";
    });
  }

  setNewPassword() {
    const passwordModel = new ResetPasswordJson();
    passwordModel.userName = this.data;
    passwordModel.password = this.form.controls.password.value;
    console.log(passwordModel);
    this.resetPassword(passwordModel);
  }
}
