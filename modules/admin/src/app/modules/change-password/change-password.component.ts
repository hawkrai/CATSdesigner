import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { questions } from '../../shared/questions';
import { AccountService } from '../../service/account.service';
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {

  @Output() submitEM = new EventEmitter();
  form: FormGroup;
  quest = questions;
  verifyValue: boolean;

  constructor(
    private dialog: MatDialog,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Username: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9_.-@]{3,30}$'),
      Validators.minLength(3), Validators.maxLength(30)]),
      SecretQuestion: new FormControl('', [Validators.required]),
      SecretAnswer: new FormControl('', [Validators.required,Validators.pattern('^[А-Яа-яA-Za-z0-9ёЁ _-]{1,30}$'),
      Validators.minLength(1), Validators.maxLength(30)])
    });
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
  cancel(){
    window.parent.location.href = "/login";
  }

  deleteSpaces() {
    if(this.form.controls.SecretAnswer != null)
      this.form.controls.SecretAnswer.setValue(this.form.controls.SecretAnswer.value.replace(' ',''));
  }

  verify() {
    this.accountService.verifySecretQuestion(this.form.controls.Username.value,
      this.form.controls.SecretQuestion.value, this.form.controls.SecretAnswer.value).subscribe(
        res => {
          if (res === 'OK') {
            document.getElementById('message').hidden = true;

            var diagRef = this.dialog.open( ResetPasswordModalComponent, {
              data: this.form.controls.Username.value
            });
            diagRef.afterClosed().subscribe(res => {window.parent.location.href = "/login";});
          } else {
            document.getElementById('message').hidden = false;
          }
        }
    );
  }

}
