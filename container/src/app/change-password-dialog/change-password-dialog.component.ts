import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { PersonalDataService } from '../core/services/personal-data.service'
import {
  FormControl,
  Validators,
  ValidationErrors,
  FormGroup,
  FormBuilder,
} from '@angular/forms'
import { TranslatePipe } from 'educats-translate'
import { AppToastrService } from '../core/services/toastr.service'

@Component({
  selector: 'change-password',
  templateUrl: './change-password-dialog.html',
  styleUrls: ['./change-password-dialog.less'],
})
export class ChangePasswordDialog implements OnInit {
  form: FormGroup

  showBadPasswordError = false

  hideOld = true
  hideNew = true
  hideNewRepeat = true
  oldPassword = ''
  newPassword = ''
  newPasswordRepeat = ''

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialog>,
    private formBuilder: FormBuilder,
    private dataService: PersonalDataService,
    private toastr: AppToastrService,
    private translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      passwordFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern('^[A-Za-z0-9_]*$'),
      ]),

      newPasswordFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern('^[A-Za-z0-9_]*$'),
        this.passwordValidator,
      ]),

      newPasswordRepeatFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern('^[A-Za-z0-9_]*$'),
      ]),
    })
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName]
    return control.invalid && control.touched
  }

  invalidForm() {
    return (
      this.form.invalid ||
      this.form.controls.newPasswordFormControl.value !=
        this.form.controls.newPasswordRepeatFormControl.value
    )
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName)
  }

  onSaveChangesClick(): void {
    this.showBadPasswordError = false
    if (this.form.valid && this.arePasswordsSame()) {
      this.dataService
        .changePassword(this.oldPassword, this.newPassword)
        .subscribe((res) => {
          if (res) {
            this.toastr.addSuccessFlashMessage(
              this.translatePipe.transform(
                'text.personalAccount.passwordChanged',
                'Пароль успешно изменен!'
              )
            )
            this.dialogRef.close()
          } else {
            this.toastr.addErrorFlashMessage(
              this.translatePipe.transform(
                'text.personalAccount.passwordNotChanged',
                'Пароль не был изменен!'
              )
            )
            this.showBadPasswordError = true
          }
        })
    }
  }

  arePasswordsSame(): boolean {
    return this.newPasswordRepeat === this.newPassword
  }

  private passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value
    const hasNumber = /[0-9]/.test(value)
    const hasCapitalLetter = /[A-Z]/.test(value)
    const hasLowercaseLetter = /[a-z]/.test(value)
    const passwordValid = hasNumber && hasCapitalLetter && hasLowercaseLetter
    if (!passwordValid) {
      return { invalid: 'Password unvalid' }
    }
    return null
  }
}
