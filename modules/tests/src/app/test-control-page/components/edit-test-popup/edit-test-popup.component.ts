import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatCheckboxChange, MatDialogRef, MatSnackBar} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Test} from "../../../models/test.model";
import {AutoUnsubscribe} from "../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormUtils} from "../../../utils/form.utils";
import {TranslatePipe} from "../../../../../../../container/src/app/pipe/translate.pipe";


@AutoUnsubscribe
@Component({
  selector: "app-edit-test-popup",
  templateUrl: "./edit-test-popup.component.html",
  styleUrls: ["./edit-test-popup.component.less"]
})
export class EditTestPopupComponent extends AutoUnsubscribeBase implements OnInit {

  public CATEGORIES = [{
    name: "text.test.for.control",
    value: "Тест для контроля знаний",
    tooltip: "Необходимо открывать доступ обучающимся для каждого прохождения теста"
  },
    {
      name: "text.test.for.self.control",
      value: "Тест для самоконтроля",
      tooltip: "Постоянно открыт для обучающихся"
    },
    {
      name: "text.test.for.pre.eumk",
      value: "Предтест для обучения в ЭУМК",
      tooltip: "Позволяет связывать вопросы теста с темами из ЭУМК, реализует адаптивное Обучение, доступен из модуля ЭУМК"
    },
    {
      name: "text.test.for.eumk",
      value: "Тест для обучения в ЭУМК",
      tooltip: "Позволяют реализовать адаптивное обучение по результатам предтеста"
    },
    {
      name: "text.test.for.nn",
      value: "Тест для обучения с искусственной нейронной сетью",
      tooltip: "Позволяет определять плохо изученные темы обучающимся"
    }];
//todo any delete
  public user: any;
  public newTest: boolean = true;
  public subject: any;
  public chosenType: any;
  public editingTest: Test;
  public formGroup: FormGroup;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testService: TestService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private translatePipe: TranslatePipe,
              public dialogRef: MatDialogRef<EditTestPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    this.subject = JSON.parse(localStorage.getItem("currentSubject"));

    if (this.data.event) {
      this.loadTests();
      console.log(this.data);
    } else {
      this.formGroup = this.formBuilder.group({
        title: new FormControl("", Validators.compose([
          Validators.maxLength(255), Validators.required
        ])),
        description: new FormControl("", Validators.compose([
          Validators.maxLength(1000)
        ])),
        countOfQuestions: new FormControl(5, Validators.compose([
          Validators.max(200),
          Validators.min(1),
          Validators.required
        ])),
        timeForCompleting: new FormControl(10, Validators.compose([
          Validators.max(150),
          Validators.min(0),
          Validators.required
        ]))
      });
      this.editingTest = new Test();
      this.editingTest.CountOfQuestions = 5;
      this.editingTest.TimeForCompleting = 10;
      this.editingTest.SetTimeForAllTest = true;
    }
  }

  public loadTests(): void {
    this.testService.getTestById(this.data.event.Id)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test) => {

        if (test.ForNN) {
          this.chosenType = "Тест для обучения с искусственной нейронной сетью";
        } else if (test.ForEUMK) {
          this.chosenType = "Тест для обучения в ЭУМК";
        } else if (test.BeforeEUMK) {
          this.chosenType = "Предтест для обучения в ЭУМК";
        } else if (test.ForSelfStudy) {
          this.chosenType = "Тест для самоконтроля";
        } else {
          this.chosenType = "Тест для контроля знаний";
        }
        this.newTest = false;
        this.editingTest = test;
        this.formGroup = this.formBuilder.group({
          title: new FormControl(this.editingTest.Title, Validators.compose([
            Validators.maxLength(255), Validators.required
          ])),
          description: new FormControl(this.editingTest.Description, Validators.compose([
            Validators.maxLength(1000)
          ])),
          countOfQuestions: new FormControl(this.editingTest.CountOfQuestions, Validators.compose([
            Validators.max(200),
            Validators.min(1),
            Validators.required
          ])),
          timeForCompleting: new FormControl(this.editingTest.TimeForCompleting, Validators.compose([
            Validators.max(150),
            Validators.min(0),
            Validators.required
          ]))
        });
      });
  }

  onYesClick() {
    if (this.formGroup.valid) {
      this.editingTest.ForSelfStudy = false;
      this.editingTest.BeforeEUMK = false;
      this.editingTest.ForEUMK = false;
      this.editingTest.ForNN = false;
      switch (this.chosenType) {
        case "Тест для самоконтроля": {
          this.editingTest.ForSelfStudy = true;
          break;
        }
        case "Предтест для обучения в ЭУМК": {
          this.editingTest.BeforeEUMK = true;
          break;
        }
        case "Тест для обучения в ЭУМК": {
          this.editingTest.ForEUMK = true;
          break;
        }
        case "Тест для обучения с искусственной нейронной сетью": {
          this.editingTest.ForNN = true;
          break;
        }
      }
      this.editingTest.SubjectId = this.subject.id;
      if (!this.chosenType) {
        this.openSnackBar(this.translatePipe.transform("text.test.choose.type", "Выберите тип"));
      } else if (this.formGroup.valid && this.editingTest.Title) {
        this.testService.saveTest(this.editingTest)
          .pipe(
            tap((message) => {
              if (message && message.ErrorMessage) {
                this.openSnackBar(message.ErrorMessage);
              } else {
                this.newTest ? this.openSnackBar(this.translatePipe.transform("text.test.created", "Тест создан")) :
                  this.openSnackBar(this.translatePipe.transform("text.test.edited", "Тест изменен"));
                this.dialogRef.close(true);
              }
            }),
            takeUntil(this.unsubscribeStream$)
          )
          .subscribe();
      }
      else {
        this.openSnackBar(this.translatePipe.transform("text.test.check.data.correctness", "Проверьте правильность заполенения данных"));
      }
    } else {
      FormUtils.highlightInvalidControls(this.formGroup);
    }
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public writeTitle(event, field): void {
    this.editingTest[field] = event.currentTarget.value;
  }

  checkBoxTrue(event: MatCheckboxChange) {
    this.editingTest.SetTimeForAllTest = !event.checked;
  }
}
