import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatCheckboxChange, MatDialogRef} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Test} from "../../../models/test.model";
import {AutoUnsubscribe} from "../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


@AutoUnsubscribe
@Component({
  selector: "app-edit-test-popup",
  templateUrl: "./edit-test-popup.component.html",
  styleUrls: ["./edit-test-popup.component.less"]
})
export class EditTestPopupComponent extends AutoUnsubscribeBase implements OnInit {

  public CATEGORIES = ["Тест для контроля знаний",
    "Тест для самоконтроля",
    "Предтест для обучения в ЭУМК",
    "Тест для обучения в ЭУМК",
    "Тест для обучения с искусственной нейронной сетью"];
//todo any delete
  public user: any;
  public subject: any;
  public chosenType: any;
  public editingTest: Test;
  public formGroup: FormGroup;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testService: TestService,
              private formBuilder: FormBuilder,
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

    this.formGroup = this.formBuilder.group({
      title: new FormControl("title", Validators.compose([
        Validators.maxLength(255), Validators.required
      ])),
      description: new FormControl("description", Validators.compose([
        Validators.maxLength(1000)
      ])),
      countOfQuestions: new FormControl("countOfQuestions", Validators.compose([
        Validators.max(200),
        Validators.min(1),
        Validators.required
      ])),
      timeForCompleting: new FormControl("timeForCompleting", Validators.compose([
        Validators.max(150),
        Validators.min(0),
        Validators.required
      ]))
    });

    if (this.data.event) {
      this.loadTests();
      console.log(this.data);
    } else {
      this.editingTest = new Test();
      this.editingTest.SetTimeForAllTest = true;
      this.chosenType = "Тест для самоконтроля";
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
        //this.chosenType = test.;
        this.editingTest = test;
      });
  }

  onYesClick() {
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
    if (this.formGroup.valid) {
      this.testService.saveTest(this.editingTest)
        .pipe(
          tap(() => this.dialogRef.close(true)),
          takeUntil(this.unsubscribeStream$)
        )
        .subscribe();
    }
  }

  public writeTitle(event, field): void {
    this.editingTest[field] = event.currentTarget.value;
  }

  checkBoxTrue(event: MatCheckboxChange) {
    this.editingTest.SetTimeForAllTest = event.checked;
  }
}
