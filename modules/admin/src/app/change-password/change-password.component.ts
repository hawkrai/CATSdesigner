import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { questions } from '../questions';
import { AccountService } from '../service/account.service';
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
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
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Username: new FormControl('', [Validators.required]),
      SecretQuestion: new FormControl(''),
      SecretAnswer: new FormControl('', [Validators.required]),
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

  verify() {
    this.accountService.verifySecretQuestion(this.form.controls.Username.value,
      this.form.controls.SecretQuestion.value, this.form.controls.SecretAnswer.value).subscribe(
        res => {
          if (res === 'OK') {
            this.dialogRef.close();
            this.dialog.open( ResetPasswordModalComponent, {
              data: this.form.controls.Username.value
            });
          } else {
            document.getElementById('message').hidden = false;
          }
        }
    );
  }

}
