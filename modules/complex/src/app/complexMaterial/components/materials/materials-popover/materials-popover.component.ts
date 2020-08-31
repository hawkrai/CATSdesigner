import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  title?: string;
  body?: any;
  buttonText?: string;
  model?: any;
}

@Component({
  selector: 'app-materials-popover',
  templateUrl: './materials-popover.component.html',
  styleUrls: ['./materials-popover.component.less']
})
export class MaterialsPopoverComponent{

  public files = [];
  page: number = 1
  pdfSrc: string = '../../../../../assets/pdfTest.pdf';

  constructor(
    public dialogRef: MatDialogRef<MaterialsPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
