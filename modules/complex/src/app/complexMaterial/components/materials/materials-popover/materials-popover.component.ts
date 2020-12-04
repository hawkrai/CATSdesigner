import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../../models/DialogData';

@Component({
  selector: 'app-materials-popover',
  templateUrl: './materials-popover.component.html',
  styleUrls: ['./materials-popover.component.less']
})
export class MaterialsPopoverComponent{

  public files = [];
  page: number = 1

  isAdaptive: boolean;
  needToChooseAdaptivityType: boolean;
  needToGetInitialTest: boolean;
  shouldWaitPresettedTime: boolean;
  showMaterial: boolean;
  toTestButtonVisible: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<MaterialsPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.isAdaptive = data.isAdaptive;
    this.needToChooseAdaptivityType = data.needToChooseAdaptivityType;
    this.needToGetInitialTest = data.needToGetInitialTest;
    this.shouldWaitPresettedTime = data.shouldWaitPresettedTime;

    this.showMaterial = !this.isAdaptive || !(this.needToChooseAdaptivityType || this.needToGetInitialTest);

    this.toTestButtonVisible = this.isAdaptive && !(this.needToChooseAdaptivityType || this.needToGetInitialTest);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
