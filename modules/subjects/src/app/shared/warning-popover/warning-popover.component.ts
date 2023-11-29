import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { DialogData } from 'src/app/models/dialog-data.model'

@Component({
  selector: 'app-warning-popover',
  templateUrl: './warning-popover.component.html',
  styleUrls: ['./warning-popover.component.less'],
})
export class WarningPopoverComponent {
  constructor(
    public dialogRef: MatDialogRef<WarningPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
