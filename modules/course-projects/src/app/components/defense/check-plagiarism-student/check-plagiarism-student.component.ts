import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { LabFilesService } from '../../../services/lab-files-service'

export interface DialogData {
  title: string
  body?: any
  buttonText: string
  model?: any
}

@Component({
  selector: 'app-delete-popover',
  templateUrl: 'check-plagiarism-student.component.html',
  styleUrls: ['./check-plagiarism-student.component.less'],
})
export class CheckPlagiarismStudentComponent implements OnInit {
  result: any
  isLoad = false

  displayedColumns = ['coeff', 'author', 'group', 'subject', 'file']

  constructor(
    public dialogRef: MatDialogRef<CheckPlagiarismStudentComponent>,
    private labService: LabFilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.labService
      .checkPlagiarism({
        subjectId: this.data.body.subjectId,
        userFileId: this.data.body.userFileId,
      })
      .subscribe((res) => {
        if (res) {
          this.result = res
        }
      })
  }

  onClick(): void {
    this.dialogRef.close()
  }

  downloadFile(element) {
    window.open(
      'http://localhost:8080/api/Upload?fileName=' +
        element.DocPathName +
        '//' +
        element.DocFileName
    )
  }
}
