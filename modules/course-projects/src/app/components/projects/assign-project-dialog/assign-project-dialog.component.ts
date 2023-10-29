import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { Student } from '../../../models/student.model'

interface DialogData {
  theme: string
  students: Student[]
}

@Component({
  selector: 'app-assign-project-dialog',
  templateUrl: './assign-project-dialog.component.html',
  styleUrls: ['./assign-project-dialog.component.less'],
})
export class AssignProjectDialogComponent {
  displayedColumns: string[] = ['position', 'name', 'group', 'action']

  constructor(
    public dialogRef: MatDialogRef<AssignProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancelClick(): void {
    this.dialogRef.close()
  }
}
