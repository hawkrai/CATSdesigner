import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { TestService } from "../../../service/test.service";
import { TestType } from "../../../models/test.model";
import { AutoUnsubscribe } from "../../../decorator/auto-unsubscribe";
import { AutoUnsubscribeBase } from "../../../core/auto-unsubscribe-base";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { FormUtils } from "../../../utils/form.utils";
import { whitespace } from "src/app/shared/validators/whitespace.validator";
import { CatsService } from "src/app/service/cats.service";
import { TranslatePipe } from "educats-translate";
import { Module, ModuleType } from "src/app/models/module.model";
import { SubjectService } from "src/app/service/subject.service";


@AutoUnsubscribe
@Component({
  selector: "app-edit-test-popup",
  templateUrl: "./edit-test-popup.component.html",
  styleUrls: ["./edit-test-popup.component.less"]
})
export class EditTestPopupComponent extends AutoUnsubscribeBase implements OnInit {

  public CATEGORIES = [{
    name: "text.test.for.control",
    value: TestType.Control,
    tooltip: "Необходимо открывать доступ обучающимся для каждого прохождения теста"
  },
  {
    name: "text.test.for.self.control",
    value: TestType.ForSelfStudy,
    tooltip: "Постоянно открыт для обучающихся"
  },
  {
    name: "text.test.for.pre.eumk",
    value: TestType.BeforeEUMK,
    tooltip: "Позволяет связывать вопросы теста с темами из ЭУМК, реализует адаптивное обучение, доступен из модуля ЭУМК"
  },
  {
    name: "text.test.for.eumk",
    value: TestType.ForEUMK,
    tooltip: "Позволяет реализовать адаптивное обучение по результатам предтеста"
  },
  {
    name: "text.test.for.nn",
    value: TestType.ForNN,
    tooltip: "Позволяет определять плохо изученные темы обучающимся"
  }];


  public newTest: boolean = true;
  public formGroup: FormGroup;
  private unsubscribeStream$: Subject<void> = new Subject<void>();
  isLoading: boolean;
  constructor(private testService: TestService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditTestPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private catsService: CatsService,
    private translatePipe: TranslatePipe,
    private subjectService: SubjectService) {
    super();
    if (this.data.event) {
      this.newTest = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    this.isLoading = true;
    const subjectId = JSON.parse(localStorage.getItem("currentSubject")).id;
    this.subjectService.getSubjectModules(subjectId).subscribe(modules => {
      this.formGroup = this.formBuilder.group({
        Title: new FormControl("", Validators.compose([
          Validators.maxLength(255), Validators.required, whitespace
        ])),
        Description: new FormControl("", Validators.compose([
          Validators.maxLength(1000), whitespace
        ])),
        CountOfQuestions: new FormControl(10, Validators.compose([
          Validators.max(200),
          Validators.min(1),
          Validators.required
        ])),
        TimeForCompleting: new FormControl(10, Validators.compose([
          Validators.max(150),
          Validators.min(0),
          Validators.required
        ])),
        SetTimeForAllTest: new FormControl(false),
        Type: new FormControl(null, [Validators.required, this.testTypeValidator(modules)]),
        jectId: new FormControl(subjectId)
      });
      if (this.data.event) {
        this.newTest = false;
        this.loadTests();
      } else {
        this.isLoading = false;
      }
    })

  }

  testTypeValidator(modules: Module[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }
      const testType = +control.value;
      if (
        Number.isInteger(testType) && ((
          testType === TestType.BeforeEUMK ||
          testType === TestType.ForEUMK ||
          testType === TestType.ForNN) &&
          !modules.some(x => x.Type === ModuleType.ComplexMaterial))) {
        return { type: true };
      }
      return null;
    };
  }

  public loadTests(): void {
    this.newTest = false;
    this.testService.getTestById(this.data.event.Id)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test) => {
        this.newTest = false;
        this.formGroup.patchValue({
          Title: test.Title,
          Description: test.Description,
          CountOfQuestions: test.CountOfQuestions,
          TimeForCompleting: test.TimeForCompleting,
          SetTimeForAllTest: !test.SetTimeForAllTest,
          Type: test.ForNN ? TestType.ForNN : test.ForEUMK ? TestType.ForEUMK : test.BeforeEUMK ? TestType.BeforeEUMK : test.ForSelfStudy ? TestType.ForSelfStudy : TestType.Control
        });
        this.isLoading = false;
      });
  }

  onYesClick() {
    if (this.formGroup.invalid) {
      FormUtils.highlightInvalidControls(this.formGroup);
      this.catsService.showMessage({ Message: this.translatePipe.transform("text.test.check.data.correctness", "Проверьте правильность заполенения данных"), Code: '500' });

      return;
    }
    const test = this.formGroup.value;
    test.ForSelfStudy = false;
    test.BeforeEUMK = false;
    test.ForEUMK = false;
    test.ForNN = false;
    switch (test.Type) {
      case TestType.ForSelfStudy: {
        test.ForSelfStudy = true;
        break;
      }
      case TestType.BeforeEUMK: {
        test.BeforeEUMK = true;
        break;
      }
      case TestType.ForEUMK: {
        test.ForEUMK = true;
        break;
      }
      case TestType.ForNN: {
        test.ForNN = true;
        break;
      }
    }
    delete test.Type;
    this.testService.saveTest({
      ...test,
      SetTimeForAllTest: !test.SetTimeForAllTest,
    })
      .pipe(
        tap((message) => {
          if (message && message.ErrorMessage) {
            this.catsService.showMessage({ Message: message.ErrorMessage, Code: '500' });
          } else {
            this.catsService.showMessage({ Message: this.newTest ? this.translatePipe.transform("text.test.created", "Тест создан") : this.translatePipe.transform("text.test.edited", "Тест изменен"), Code: '200' });
            this.dialogRef.close(true);
          }
        }),
        takeUntil(this.unsubscribeStream$)
      )
      .subscribe();
  }

}
