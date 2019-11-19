import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatCheckboxChange, MatDialogRef} from '@angular/material';
import {TestService} from '../../../service/test.service';
import {Test} from "../../../models/test.model";


@Component({
  selector: 'app-edit-test-popup',
  templateUrl: './edit-test-popup.component.html',
  styleUrls: ['./edit-test-popup.component.css']
})
export class EditTestPopupComponent implements OnInit {

  public CATEGORIES = ['Тест для контроля знаний',
    'Тест для самоконтроля',
    'Предтест для обучения в ЭУМК',
    'Тест для обучения в ЭУМК',
    'Тест для обучения с искусственной нейронной сетью'];

  public chosenType: any;
  public editingTest: Test;
  public test: Test = new Test();

  constructor(private testService: TestService,
              public dialogRef: MatDialogRef<EditTestPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data.event) {
      this.testService.getTestTestById(this.data.event.Id).subscribe((test) => {
        this.editingTest = test;
      });
      console.log(this.data);
    } else {
      this.editingTest = new Test();
    }
  }

  onYesClick() {
    switch (this.chosenType) {
      case 'Тест для самоконтроля': {
        this.test['ForSelfStudy'] = true;
        break;
      }
      case 'Предтест для обучения в ЭУМК': {
        this.test['BeforeEUMK'] = true;
        break;
      }
      case 'Тест для обучения в ЭУМК': {
        this.test['ForEUMK'] = true;
        break;
      }
      case 'Тест для обучения с искусственной нейронной сетью': {
        this.test['ForNN'] = true;
        break;
      }
    }
    this.test['SubjectId'] = 3;
    this.testService.saveTest(this.test).subscribe();
    this.dialogRef.close("fdfd");


  }

  public writeTitle(event, field): void {
    this.test[field] = event.currentTarget.value;
  }

  checkBoxTrue(event: MatCheckboxChange) {
    this.test['SetTimeForAllTest'] = event.checked;
  }
}
