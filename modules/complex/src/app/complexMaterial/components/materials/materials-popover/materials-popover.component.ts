import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../../models/DialogData';
import { AdaptivityService } from '../../../../service/adaptivity.service';

@Component({
  selector: 'app-materials-popover',
  templateUrl: './materials-popover.component.html',
  styleUrls: ['./materials-popover.component.less']
})
export class MaterialsPopoverComponent{

  public files = [];
  page: number = 1

  isAdaptive: boolean;
  needToGetInitialTest: boolean;
  shouldWaitPresettedTime: boolean;
  showMaterial: boolean;
  showTimer: boolean;
  toTestButtonVisible: boolean;
  toTestButtonEnabled: boolean;

  adaptivityType: number;

  seconds: number;
  time: string;

  constructor(
    public dialogRef: MatDialogRef<MaterialsPopoverComponent>,
    private adaptivityService: AdaptivityService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    debugger;
    this.isAdaptive = data.isAdaptive;
    this.needToGetInitialTest = data.needToGetInitialTest;
    this.shouldWaitPresettedTime = data.shouldWaitPresettedTime;

    this.showMaterial = !this.isAdaptive || !this.needToGetInitialTest;

    this.toTestButtonVisible = this.isAdaptive && !this.needToGetInitialTest;

    if (this.isAdaptive && this.shouldWaitPresettedTime) {
      this.showTimer = true;
      this.toTestButtonEnabled = false;
      this.seconds = 15;
      this.countDown();
    }
    else {
      this.showTimer = false;
      this.toTestButtonEnabled = true;
    }

  }

  processAndSavePredTest(): void {
    this.adaptivityService.processPredTtest('1', '2').subscribe(res => {
      if ((res as any).Code == '200') {
        this.adaptivityService.getNextThemaRes('1', '2', '3', this.adaptivityType).subscribe(themaRes => {
          this.needToGetInitialTest = themaRes.needToDoPredTest;
          this.shouldWaitPresettedTime = themaRes.shouldWaitPresettedTime;
        });
      }
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
