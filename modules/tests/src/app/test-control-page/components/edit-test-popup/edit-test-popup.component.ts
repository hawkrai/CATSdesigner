import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatCheckboxChange, MatDialogRef} from '@angular/material';
import {TestService} from '../../../service/test.service';
import {Test} from "../../../models/test.model";
import {AutoUnsubscribe} from "../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@AutoUnsubscribe
@Component({
  selector: 'app-edit-test-popup',
  templateUrl: './edit-test-popup.component.html',
  styleUrls: ['./edit-test-popup.component.less']
})
export class EditTestPopupComponent extends AutoUnsubscribeBase implements OnInit {

  public CATEGORIES = ['Тест для контроля знаний',
    'Тест для самоконтроля',
    'Предтест для обучения в ЭУМК',
    'Тест для обучения в ЭУМК',
    'Тест для обучения с искусственной нейронной сетью'];

  public chosenType: any;
  public editingTest: Test;
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private testService: TestService,
              public dialogRef: MatDialogRef<EditTestPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    if (this.data.event) {
      this.loadTests();
      console.log(this.data);
    } else {
      this.editingTest = new Test();
    }
  }
  public loadTests():void{
    this.testService.getTestTestById(this.data.event.Id)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((test) => {
      this.editingTest = test;
    });
  }

  onYesClick() {
    switch (this.chosenType) {
      case 'Тест для самоконтроля': {
        this.editingTest['ForSelfStudy'] = true;
        break;
      }
      case 'Предтест для обучения в ЭУМК': {
        this.editingTest['BeforeEUMK'] = true;
        break;
      }
      case 'Тест для обучения в ЭУМК': {
        this.editingTest['ForEUMK'] = true;
        break;
      }
      case 'Тест для обучения с искусственной нейронной сетью': {
        this.editingTest['ForNN'] = true;
        break;
      }
    }
    this.editingTest['SubjectId'] = 3;
    this.testService.saveTest(this.editingTest)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe();
    this.dialogRef.close(true);


  }

  public writeTitle(event, field): void {
    this.editingTest[field] = event.currentTarget.value;
  }

  checkBoxTrue(event: MatCheckboxChange) {
    this.editingTest['SetTimeForAllTest'] = event.checked;
  }
}
