import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
import { StudentService } from 'src/app/service/student.service'
import { Student } from 'src/app/model/student'
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
  ValidationErrors,
} from '@angular/forms'
import { MustMatch } from 'src/app/shared/utils/MustMatch'
import { ProfessorService } from 'src/app/service/professor.service'
import { UserService } from 'src/app/service/userService'
import { ResetPassword } from 'src/app/model/resetPassword'
import { MatDialog } from '@angular/material'
import { MessageComponent } from '../../../component/message/message.component'
import { AppToastrService } from 'src/app/service/toastr.service'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-reset-the-password',
  templateUrl: './reset-the-password.component.html',
  styleUrls: ['./reset-the-password.component.css'],
})
export class ResetThePasswordComponent implements OnInit {
  student
  isLoad = false
  form: FormGroup
  hidePassword = true
  hideConfirm = true
  password = ''
  confirmPassword = ''
  fullName = ''
  login = ''
  @Output() submitEM = new EventEmitter()

  constructor(
    private userService: UserService,
    private lectorService: ProfessorService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: AppToastrService,
    private translatePipe: TranslatePipe,
    private location: Location
  ) {}

  ngOnInit() {
    const studentId = this.route.snapshot.params.studentId
    const lectorId = this.route.snapshot.params.lectorId
    if (studentId) {
      this.getStudent(studentId)
    }
    if (lectorId) {
      this.getLector(lectorId)
    }
    this.form = this.formBuilder.group(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^[A-Za-z0-9_]*$'),
          Validators.maxLength(30),
          this.passwordValidator,
        ]),
        confirmPassword: new FormControl(''),
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    )
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

  getStudent(studentId) {
    this.studentService.getStudentById(studentId).subscribe((item) => {
      this.student = item
      this.login = this.student.UserName
      this.fullName = this.student.Name + ' ' + this.student.Surname
      this.isLoad = true
    })
  }

  getLector(lectorId) {
    this.lectorService.getProfessorById(lectorId).subscribe((item) => {
      this.student = item
      this.login = this.student.Login
      this.fullName = this.student.FullName
      this.isLoad = true
    })
  }

  resetPassword(resetPasswordModel) {
    this.userService.resetPassword(resetPasswordModel).subscribe(
      () => {
        this.toastr.addSuccessFlashMessage(
          this.translatePipe.transform(
            'text.adminPanel.resetPassword.success',
            'text.adminPanel.resetPassword.success'
          )
        )
        window.history.back()
      },
      (err) => {
        this.toastr.addErrorFlashMessage(
          this.translatePipe.transform(
            'text.adminPanel.resetPassword.error',
            'text.adminPanel.resetPassword.error'
          )
        )
        window.history.back()
      }
    )
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

  setNewPassword() {
    const passwordModel = new ResetPassword()
    passwordModel.FullName = this.student.FullName
    passwordModel.Login = this.student.UserName || this.student.Login
    passwordModel.Password = this.form.controls.password.value
    passwordModel.ConfirmPassword = this.form.controls.confirmPassword.value
    console.log(passwordModel)
    this.resetPassword(passwordModel)
  }

  back(): void {
    this.location.back()
  }
}
