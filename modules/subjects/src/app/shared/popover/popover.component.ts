import {Component, ElementRef, Inject, ViewContainerRef} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface DialogData {
  title: string;
  body?: any;
  buttonText: string;
  model?: any;
}

@Component({
  selector: 'app-popover',
  templateUrl: 'popover.component.html',
  styleUrls: ['./popover.component.less']
})
export class PopoverComponent {

  constructor(
    public dialogRef: MatDialogRef<PopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onClick(): void {
    this.dialogRef.close();
  }
}
