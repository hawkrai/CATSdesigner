import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from '../../models/dialog-data.model';

@Component({
  selector: 'app-delete-popover',
  templateUrl: 'delete-popover.component.html',
  styleUrls: ['./delete-popover.component.less']
})
export class DeletePopoverComponent {

  constructor(
    public dialogRef: MatDialogRef<DeletePopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

}
