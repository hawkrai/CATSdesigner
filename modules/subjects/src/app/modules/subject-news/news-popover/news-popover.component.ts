import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../models/dialog-data.model';


@Component({
  selector: 'app-news-popover',
  templateUrl: './news-popover.component.html',
  styleUrls: ['./news-popover.component.less']
})
export class NewsPopoverComponent {

  constructor(
    public dialogRef: MatDialogRef<NewsPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onClick(): void {
    this.dialogRef.close();
  }

}
