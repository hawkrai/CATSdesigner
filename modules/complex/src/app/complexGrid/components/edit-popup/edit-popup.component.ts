import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DialogData } from '../../../models/DialogData'
import { CatsService, CodeType } from 'src/app/service/cats.service'
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
    private catsService: CatsService,
    private translatePipe: TranslatePipe
  ) {
    this.dialogRef.disableClose = true
  }

  onClick(): void {
    this.dialogRef.close()
  }

  onSave(data): void {
    this.dialogRef.close(data)

    this.catsService.showMessage({
      Message: `${this.translatePipe.transform(
        'common.success.operation',
        'Успешно сохранено'
      )}.`,
      Type: CodeType.success,
    })
  }
}
