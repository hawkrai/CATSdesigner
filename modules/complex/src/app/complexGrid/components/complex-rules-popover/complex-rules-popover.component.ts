import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  title?: string;
  body?: any;
  buttonText?: string;
  model?: any;
}

@Component({
  selector: 'app-complex-rules-popover',
  templateUrl: './complex-rules-popover.component.html',
  styleUrls: ['./complex-rules-popover.component.less']
})
export class ComplexRulesPopoverComponent {

  public files = [];
  page: number = 1
  pdfSrc: string = '../../../../../assets/Polozhenie.pdf';

  constructor(
    public dialogRef: MatDialogRef<ComplexRulesPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
