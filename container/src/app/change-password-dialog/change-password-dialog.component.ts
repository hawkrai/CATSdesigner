import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PersonalDataService } from '../core/services/personal-data.service';
import { FormControl, Validators, ValidationErrors } from '@angular/forms';
import { TranslatePipe } from '../pipe/translate.pipe';
import { AppToastrService } from '../core/services/toastr.service';

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
    public dialogRef: MatDialogRef<ChangePasswordDialog>, private dataService: PersonalDataService, private toastr: AppToastrService, private translatePipe: TranslatePipe) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveChangesClick(): void {
    this.showBadPasswordError = false;
    if (this.newPasswordFormControl.valid && this.arePasswordsSame()) {
        this.dataService.changePassword(this.oldPassword, this.newPassword).subscribe((res) => {
          if (res) {
            this.toastr.addSuccessFlashMessage(this.translatePipe.transform('text.personalAccount.passwordChanged', "Пароль успешно изменен!"));
            this.dialogRef.close();
          }
          else {
            this.toastr.addErrorFlashMessage(this.translatePipe.transform('text.personalAccount.passwordNotChanged', "Пароль не был изменен!"));
            this.showBadPasswordError = true;
          }
        });   
    }
  }

  arePasswordsSame(): boolean {
    return this.newPasswordRepeat === this.newPassword;
  }


}

