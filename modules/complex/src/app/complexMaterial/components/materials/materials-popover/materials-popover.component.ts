import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../../models/DialogData';
import { AdaptivityService } from '../../../../service/adaptivity.service';
import { TestExecutionComponent } from '../adaptiveLearningTests/adaptive-learning-test.component';
import { TestService } from '../../../../service/test.service';
import { Adaptivity } from '../../../../models/Adaptivity';

@Component({
  selector: 'app-materials-popover',
  templateUrl: './materials-popover.component.html',
  styleUrls: ['./materials-popover.component.less']
})


export class MaterialsPopoverComponent{

  public files = [];
  page: number = 1;
  path: string;

  themaId: string;
  adaptivityType: number;

  isAdaptive: boolean;
  needToGetInitialTest: boolean;
  shouldWaitPresettedTime: boolean;
  showMaterial: boolean;
  isEndLearning: boolean;

  showTimer: boolean;
  seconds: number;
  studentSeconds: number = 0;
  time: string;

  isTest: boolean;
  testId: string;
  isPredTest: boolean;

  toTestButtonVisible: boolean;
  toTestButtonEnabled: boolean; 

  constructor(
    public dialogRef: MatDialogRef<MaterialsPopoverComponent>,
    private adaptivityService: AdaptivityService,
    private testService: TestService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.path = data.url;    
    this.isAdaptive = data.isAdaptive;

    if (this.isAdaptive) {
      this.adaptivityType = data.adaptivityType;
      this.initFieldsByAdaptivity(data.adaptivity);
      this.countWatchTime()
    }
    else {
      this.showMaterial = true;
      this.toTestButtonVisible = false;
    }
  }

  initFieldsByAdaptivity(adaptivity: Adaptivity) {
    this.themaId = adaptivity.nextThemaId;
    this.needToGetInitialTest = adaptivity.needToDoPredTest;
    this.shouldWaitPresettedTime = adaptivity.shouldWaitPresettedTime;
    this.isEndLearning = adaptivity.isLearningEnded;

    this.showMaterial = !(this.needToGetInitialTest || this.isTest || this.isEndLearning);

    this.toTestButtonVisible = this.showMaterial;

    if (this.shouldWaitPresettedTime) {
      this.showTimer = true;
      this.toTestButtonEnabled = false;
      this.seconds = adaptivity.timeToWait;
      this.countDown();
    }
    else {
      this.showTimer = false;
      this.toTestButtonEnabled = true;
    }
  }

  processsTest() {
    if (this.isPredTest) {
      this.processAndSavePredTest()
    }
    else {
      this.processTestAndGetNext()
    }
  }

  processTestAndGetNext() {
    this.adaptivityService.getNextThemaRes(this.testId, this.themaId, this.adaptivityType).subscribe(res => {
      this.path = '/api/Upload?fileName=' + res.nextMaterialPath;
      this.isTest = false;
      this.studentSeconds = 0;
      this.initFieldsByAdaptivity(res);
    });
  }

  processAndSavePredTest(): void {
    this.adaptivityService.processPredTtest(this.testId, this.adaptivityType).subscribe(res => {
      this.path = '/api/Upload?fileName=' + res.nextMaterialPath;
      this.isTest = false;
      this.studentSeconds = 0;
      this.initFieldsByAdaptivity(res);
    });
  }


  goToTests() {
    this.adaptivityService.getTestId(this.themaId, this.studentSeconds, this.adaptivityType).subscribe(res => {
      this.testId = `${res}`;
      this.isTest = true;
      this.isPredTest = false;

      this.showMaterial = false;
      this.toTestButtonVisible = false;
      this.needToGetInitialTest = false;
      this.shouldWaitPresettedTime = false;
    });
  }

  goToPredTest() {
    this.testService.getPredTest().subscribe(res => {
      this.testId = `${res}`;
      this.isTest = true;
      this.isPredTest = true;

      this.showMaterial = false;
      this.toTestButtonVisible = false;
      this.needToGetInitialTest = false;
      this.shouldWaitPresettedTime = false;
    });
  }

  countDown() {
    window.setInterval(() => {
      this.seconds -= 1;
      this.time = this.getStrTime();
      if (this.seconds == 0) {
        this.toTestButtonEnabled = true;
        this.showTimer = false;
        return;
      }
    }, 1000);
  }

  countWatchTime() {
    window.setInterval(() => {
      this.studentSeconds += 1;      
    }, 1000);
  }

  getStrTime(): string {
    if (this.seconds > 60) {
      var min = Math.floor(this.seconds / 60);
      var sec = this.seconds % 60;
    }
    else {
      var sec = this.seconds;
      var min = 0;
    }
    var minStr = min < 10 ? '0' + min : min;
    var secStr = sec < 10 ? '0' + sec : sec;  
    return `${minStr}:${secStr}`
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
