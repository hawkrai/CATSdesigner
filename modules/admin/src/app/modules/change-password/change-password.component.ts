import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { questions } from '../../shared/utils/questions'
import { AccountService } from '../../service/account.service'
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component'
import { Locale } from '../../../../../../container/src/app/shared/interfaces/locale.interface'
import { VideoComponent } from '../modal/video.component'
import { Router } from '@angular/router'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less'],
})
export class ChangePasswordComponent implements OnInit {
  @Output() submitEM = new EventEmitter()
  form: FormGroup
  quest = []
  verifyValue: boolean

  public locales: Locale[] = [
    { name: 'Ru', value: 'ru' },
    { name: 'En', value: 'en' },
  ]
  public locale: Locale

  constructor(
    private dialog: MatDialog,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private translatePipe: TranslatePipe,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      Username: new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9_.-@]{3,30}$'),
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      SecretQuestion: new FormControl('', [Validators.required]),
      SecretAnswer: new FormControl('', [
        Validators.required,
        Validators.pattern('^[А-Яа-яA-Za-z0-9ёЁ _-]{1,30}$'),
        Validators.minLength(1),
        Validators.maxLength(30),
      ]),
    })

    this.quest = questions.map((x) => ({
      value: x.value,
      text: this.translatePipe.localization[x.text],
    }))

    const local: string = localStorage.getItem('locale')
    this.locale = local
      ? this.locales.find((locale: Locale) => locale.value === local)
      : this.locales[0]
  }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName)
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName]
    return control.invalid && control.touched
  }

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value)
    }
  }
  cancel() {
    window.parent.location.href = '/login'
  }

  public onValueChange(value: any): void {
    localStorage.setItem('locale', value.value.value)
    window.location.reload()
  }

  deleteSpaces() {
    if (this.form.controls.SecretAnswer != null) {
      this.form.controls.SecretAnswer.setValue(
        this.form.controls.SecretAnswer.value.replace(' ', '')
      )
    }
  }

  verify() {
    this.accountService
      .verifySecretQuestion(
        this.form.controls.Username.value,
        this.form.controls.SecretQuestion.value,
        this.form.controls.SecretAnswer.value
      )
      .subscribe((res) => {
        document.getElementById('secretQuestionIsInvalid').hidden = true
        document.getElementById('secretQuestionIsUndefined').hidden = true

        if (res === 'OK') {
          const diagRef = this.dialog.open(ResetPasswordModalComponent, {
            data: this.form.controls.Username.value,
          })
          diagRef.afterClosed().subscribe(() => {
            window.parent.location.href = '/login'
          })
        } else {
          if (
            res === 'Пароль данного пользвателя не может быть восстановлен!'
          ) {
            document.getElementById('secretQuestionIsUndefined').hidden = false
          } else {
            document.getElementById('secretQuestionIsInvalid').hidden = false
          }
        }
      })
  }

  public open() {
    const dialogRef = this.dialog.open(VideoComponent, {
      hasBackdrop: true,
    })
  }

  routeToLogin() {
    window.parent.location.href = '/login'
  }
}
