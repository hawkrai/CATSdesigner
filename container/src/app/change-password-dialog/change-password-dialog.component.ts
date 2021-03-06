import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PersonalDataService } from '../core/services/personal-data.service';
import { FormGroupDirective, FormControl, NgForm, Validators, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';


@Component({
  selector: 'change-password',
  templateUrl: './change-password-dialog.html',
  styleUrls: ['./change-password-dialog.less']
})
export class ChangePasswordDialog {

  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[A-Za-z0-9_]{6,30}$'), this.passwordValidator])

  newPasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[A-Za-z0-9_]{6,30}$'), this.passwordValidator])

  newPasswordRepeatFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[A-Za-z0-9_]{6,30}$'), this.passwordValidator])
  private passwordValidator(control: FormControl): ValidationErrors {
    return null;
  }

  showBadPasswordError = false;

  hideOld = true;
  hideNew = true;
  hideNewRepeat = true;
  oldPassword = "";
  newPassword = "";
  newPasswordRepeat = "";

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialog>, private dataService: PersonalDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveChangesClick(): void {
    this.showBadPasswordError = false;
    if (this.arePasswordsSame()) {
      if (confirm("Вы уверены, что хотите изменить пароль?")) {
        this.dataService.changePassword(this.oldPassword, this.newPassword).subscribe((res) => {
          if (res) {
            alert("Пароль успешно изменен!");
            this.dialogRef.close();
          }
          else {
            alert("Произошел сбой, пароль не был изменен!");
          }
        });
      }
    }
    else { this.showBadPasswordError = true; }
  }

  arePasswordsSame(): boolean {
    return this.newPasswordRepeat === this.newPassword;
  }



}

