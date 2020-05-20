import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../../models/dialog-data.model';


@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './lab-work-popover.component.html',
  styleUrls: ['./lab-work-popover.component.less']
})
export class LabWorkPopoverComponent {

  constructor(
    public dialogRef: MatDialogRef<LabWorkPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
  onClick(): void {
    this.dialogRef.close();
  }

  addFile() {

  }


}
