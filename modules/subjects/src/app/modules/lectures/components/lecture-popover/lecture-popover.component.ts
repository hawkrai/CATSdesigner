import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../models/dialog-data.model';

@Component({
  selector: 'app-lecture-popover',
  templateUrl: './lecture-popover.component.html',
  styleUrls: ['./lecture-popover.component.less']
})
export class LecturePopoverComponent {

  constructor(
    public dialogRef: MatDialogRef<LecturePopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
  onClick(): void {
    this.dialogRef.close();
  }

  addFile() {

  }


}
