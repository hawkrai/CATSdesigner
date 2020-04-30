import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-add-date-dialog',
  templateUrl: './add-date-dialog.component.html',
  styleUrls: ['./add-date-dialog.component.less']
})
export class AddDateDialogComponent {

  private date = new FormControl(new Date());

  constructor(public dialogRef: MatDialogRef<AddDateDialogComponent>) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
