import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DialogData } from '../../../models/DialogData'

@Component({
  selector: 'grid-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.less'],
})
export class ComplexGridEditPopupComponent {
  public files = []

  constructor(
    public dialogRef: MatDialogRef<ComplexGridEditPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogRef.disableClose = true
  }

  onClick(): void {
    this.dialogRef.close()
  }

  onSave(data): void {
    this.dialogRef.close(data)
  }
}
