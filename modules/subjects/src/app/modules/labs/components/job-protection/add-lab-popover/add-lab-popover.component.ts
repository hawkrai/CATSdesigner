import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../../models/dialog-data.model';


@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './add-lab-popover.component.html',
  styleUrls: ['./add-lab-popover.component.less']
})
export class AddLabPopoverComponent {

  constructor(
    public dialogRef: MatDialogRef<AddLabPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
  onClick(): void {
    this.dialogRef.close();
  }

  addFile() {

  }


}
