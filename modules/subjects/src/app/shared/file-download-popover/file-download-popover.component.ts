import {Component, ElementRef, Inject, ViewContainerRef} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from '../../models/dialog-data.model';

@Component({
  selector: 'app-file-download-popover',
  templateUrl: 'file-download-popover.component.html',
  styleUrls: ['./file-download-popover.component.less']
})
export class FileDownloadPopoverComponent {

  constructor(
    public dialogRef: MatDialogRef<FileDownloadPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onClick(): void {
    this.dialogRef.close();
  }
}
