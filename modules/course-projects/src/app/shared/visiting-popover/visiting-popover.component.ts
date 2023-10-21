import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

export interface DialogData {
  title: string
  body?: any
  buttonText: string
  model?: any
}

@Component({
  selector: 'app-visiting-popover',
  templateUrl: 'visiting-popover.component.html',
  styleUrls: ['./visiting-popover.component.less'],
})
export class VisitingPopoverComponent {
  private invalid = false

  public displayedColumns = ['position', 'name', 'mark', 'comment']

  constructor(
    public dialogRef: MatDialogRef<VisitingPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClick(): void {
    this.dialogRef.close()
  }

  onMarkChange(mark: number) {
    this.invalid = mark != null && mark < 0
  }
}
