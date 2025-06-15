import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DialogData } from '../../../models/DialogData'
import { ToastrService } from 'ngx-toastr'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'grid-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.less'],
})
export class ComplexGridEditPopupComponent {
  public files = []

  constructor(
    public dialogRef: MatDialogRef<ComplexGridEditPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe
  ) {
    this.dialogRef.disableClose = true
  }

  onClick(): void {
    this.dialogRef.close()
  }

  onSave(data): void {
    this.toastr.success(
      this.translatePipe.transform(
        'common.save.successful',
        'Изменения успешно сохранены!'
      )
    )

    this.dialogRef.close(data)
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
