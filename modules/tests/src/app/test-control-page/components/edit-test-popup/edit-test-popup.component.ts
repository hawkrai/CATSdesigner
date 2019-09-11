import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TestService} from '../../../service/test.service';
import {TestAvailable} from '../../../models/test-available.model';


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
  public editingTest: any;

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
      this.editingTest = new TestAvailable();
    }
  }

}
