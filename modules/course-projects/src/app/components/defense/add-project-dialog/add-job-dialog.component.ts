import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  body?: any;
  buttonText: string;
  model?: any;
}

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-job-dialog.component.html',
  styleUrls: ['./add-job-dialog.component.less']
})
export class AddJobDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
  onClick(): void {
    this.dialogRef.close();
  }

  addFile() {

  }


}
