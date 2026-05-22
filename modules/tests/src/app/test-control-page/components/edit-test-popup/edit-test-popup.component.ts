import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { TestService } from '../../../service/test.service'
import { TestType } from '../../../models/test.model'
import { AutoUnsubscribe } from '../../../decorator/auto-unsubscribe'
import { AutoUnsubscribeBase } from '../../../core/auto-unsubscribe-base'
import { Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { FormUtils } from '../../../utils/form.utils'
import { whitespace } from 'src/app/shared/validators/whitespace.validator'
import { CatsService } from 'src/app/service/cats.service'
import { TranslatePipe } from 'educats-translate'
import { Module, ModuleType } from 'src/app/models/module.model'
import { SubjectService } from 'src/app/service/subject.service'

@AutoUnsubscribe
@Component({
  selector: 'app-edit-test-popup',
  templateUrl: './edit-test-popup.component.html',
  styleUrls: ['./edit-test-popup.component.less'],
})
export class EditTestPopupComponent
  extends AutoUnsubscribeBase
  implements OnInit
{
  public CATEGORIES = [
    {
      name: 'text.test.for.control',
      value: TestType.Control,
      tooltip: 'text.test.for.control.hint',
    },
    {
      name: 'text.test.for.self.control',
      value: TestType.ForSelfStudy,
      tooltip: 'text.test.for.self.control.hint',
    },
    {
      name: 'text.test.for.pre.eumk',
      value: TestType.BeforeEUMK,
      tooltip: 'text.test.for.pre.eumk.hint',
    },
    {
      name: 'text.test.for.eumk',
      value: TestType.ForEUMK,
      tooltip: 'text.test.for.eumk.hint',
    },
    {
      name: 'text.test.for.nn',
      value: TestType.ForNN,
      tooltip: 'text.test.for.nn.hint',
    },
  ]

  public newTest: boolean = true
  public formGroup: FormGroup
  public eumkRoots: { Id: number; Name: string }[] = []
  public eumkRootsLoading = false
  public hasQuestions = false
  private subjectId: number
  private eumkRootsLoaded = false
  private unsubscribeStream$: Subject<void> = new Subject<void>()
  isLoading: boolean
  constructor(
    private testService: TestService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditTestPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private catsService: CatsService,
    private translatePipe: TranslatePipe,
    private subjectService: SubjectService
  ) {
    super()
    if (this.data.event) {
      this.newTest = false
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false)
  }

  ngOnInit() {
    this.isLoading = true
    this.subjectId = JSON.parse(localStorage.getItem('currentSubject')).id
    this.subjectService
      .getSubjectModules(this.subjectId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((modules) => {
        this.formGroup = this.formBuilder.group({
          Title: new FormControl(
            '',
            Validators.compose([
              Validators.maxLength(255),
              Validators.required,
              whitespace,
            ])
          ),
          Description: new FormControl(
            '',
            Validators.compose([Validators.maxLength(1000), whitespace])
          ),
          CountOfQuestions: new FormControl(
            10,
            Validators.compose([
              Validators.max(200),
              Validators.min(1),
              Validators.required,
            ])
          ),
          TimeForCompleting: new FormControl(
            10,
            Validators.compose([
              Validators.max(150),
              Validators.min(0),
              Validators.required,
            ])
          ),
          SetTimeForAllTest: new FormControl(false),
          Type: new FormControl(null, [
            Validators.required,
            this.testTypeValidator(modules),
          ]),
          EumkRootConceptId: new FormControl(null),
          SubjectId: new FormControl(this.subjectId),
        })
        this.formGroup
          .get('Type')
          .valueChanges.pipe(takeUntil(this.unsubscribeStream$))
          .subscribe((type) => this.onTestTypeChanged(type))
        if (this.data.event) {
          this.newTest = false
          this.loadTests()
        } else {
          this.isLoading = false
        }
      })
  }

  public get isEumkTestType(): boolean {
    const type = this.formGroup?.get('Type')?.value
    if (type == null) {
      return false
    }
    const n = +type
    return n === TestType.BeforeEUMK || n === TestType.ForEUMK
  }

  public get isEumkLocked(): boolean {
    const eumkId = this.formGroup?.get('EumkRootConceptId')?.value
    return this.hasQuestions && !!eumkId
  }

  private onTestTypeChanged(type: number | null): void {
    if (type == null) {
      return
    }
    const testType = +type
    this.updateEumkRootValidators(testType)
    if (testType === TestType.BeforeEUMK || testType === TestType.ForEUMK) {
      this.ensureEumkRootsLoaded()
    }
  }

  private ensureEumkRootsLoaded(): void {
    if (this.eumkRootsLoaded || this.eumkRootsLoading) {
      return
    }
    this.eumkRootsLoading = true
    this.testService
      .getEumkRoots(String(this.subjectId))
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe(
        (roots) => {
          this.eumkRoots = roots
          this.eumkRootsLoaded = true
          this.eumkRootsLoading = false
          const control = this.formGroup.get('EumkRootConceptId')
          if (control && !control.value && this.eumkRoots.length === 1) {
            control.setValue(this.eumkRoots[0].Id)
          }
        },
        () => {
          this.eumkRootsLoading = false
        }
      )
  }

  private updateEumkRootValidators(testType: number): void {
    const control = this.formGroup.get('EumkRootConceptId')
    if (!control) {
      return
    }
    if (testType === TestType.BeforeEUMK || testType === TestType.ForEUMK) {
      control.setValidators([Validators.required])
    } else {
      control.clearValidators()
      control.setValue(null)
    }
    control.updateValueAndValidity()
  }

  testTypeValidator(modules: Module[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null
      }
      const testType = +control.value
      if (
        Number.isInteger(testType) &&
        (testType === TestType.BeforeEUMK ||
          testType === TestType.ForEUMK ||
          testType === TestType.ForNN) &&
        !modules.some((x) => x.Type === ModuleType.ComplexMaterial)
      ) {
        return { type: true }
      }
      return null
    }
  }

  public loadTests(): void {
    this.newTest = false
    this.testService
      .getTestById(this.data.event.Id)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test) => {
        this.hasQuestions = !!this.data.event?.HasQuestions
        const testType = test.ForNN
          ? TestType.ForNN
          : test.ForEUMK
            ? TestType.ForEUMK
            : test.BeforeEUMK
              ? TestType.BeforeEUMK
              : test.ForSelfStudy
                ? TestType.ForSelfStudy
                : TestType.Control
        this.formGroup.patchValue({
          Title: test.Title,
          Description: test.Description,
          CountOfQuestions: test.CountOfQuestions,
          TimeForCompleting: test.TimeForCompleting,
          SetTimeForAllTest: !test.SetTimeForAllTest,
          Type: testType,
          EumkRootConceptId: test.EumkRootConceptId || null,
        })
        this.updateEumkRootValidators(testType)
        if (testType === TestType.BeforeEUMK || testType === TestType.ForEUMK) {
          this.ensureEumkRootsLoaded()
          if (!test.EumkRootConceptId && this.data.event?.Id) {
            this.inferEumkRootFromQuestions(this.data.event.Id)
          }
        }
        this.isLoading = false
      })
  }

  private inferEumkRootFromQuestions(testId: number): void {
    this.testService
      .getQuestionsByTest(String(testId))
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((questions) => {
        const conceptId = questions?.find((q) => q.ConceptId)?.ConceptId
        if (!conceptId) {
          return
        }
        this.testService
          .getConceptRootId(conceptId)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe((rootId) => {
            if (rootId) {
              this.formGroup.patchValue({ EumkRootConceptId: rootId })
            }
          })
      })
  }

  onYesClick() {
    if (this.formGroup.invalid) {
      FormUtils.highlightInvalidControls(this.formGroup)
      this.catsService.showMessage({
        Message: this.translatePipe.transform(
          'text.test.check.data.correctness',
          'Проверьте правильность заполенения данных'
        ),
        Code: '500',
      })

      return
    }
    const test = this.formGroup.value
    test.ForSelfStudy = false
    test.BeforeEUMK = false
    test.ForEUMK = false
    test.ForNN = false
    switch (test.Type) {
      case TestType.ForSelfStudy: {
        test.ForSelfStudy = true
        break
      }
      case TestType.BeforeEUMK: {
        test.BeforeEUMK = true
        break
      }
      case TestType.ForEUMK: {
        test.ForEUMK = true
        break
      }
      case TestType.ForNN: {
        test.ForNN = true
        break
      }
    }
    delete test.Type
    if (!test.BeforeEUMK && !test.ForEUMK) {
      test.EumkRootConceptId = null
    }
    let saveTestDto = {
      ...test,
      SetTimeForAllTest: !test.SetTimeForAllTest,
    }

    if (this.data.event) {
      saveTestDto = {
        ...saveTestDto,
        Id: this.data.event.Id,
      }
    }

    this.testService
      .saveTest(saveTestDto)
      .pipe(
        tap((message) => {
          if (message && message.ErrorMessage) {
            this.catsService.showMessage({
              Message: message.ErrorMessage,
              Code: '500',
            })
          } else {
            this.catsService.showMessage({
              Message: this.newTest
                ? this.translatePipe.transform(
                    'text.test.created',
                    'Тест создан'
                  )
                : this.translatePipe.transform(
                    'text.test.edited',
                    'Тест изменен'
                  ),
              Code: '200',
            })
            this.dialogRef.close(true)
          }
        }),
        takeUntil(this.unsubscribeStream$)
      )
      .subscribe()
  }
}
