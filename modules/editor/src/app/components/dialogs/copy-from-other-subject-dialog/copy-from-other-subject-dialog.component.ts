import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DocumentPreview } from 'src/app/models/DocumentPreview'
import { DocumentService } from 'src/app/services/document.service'
import { TranslatePipe } from 'educats-translate'
import * as StringHelper from './../../../helpers/string-helper'

@Component({
  selector: 'app-copy-from-other-subject-dialog',
  templateUrl: './copy-from-other-subject-dialog.component.html',
  styleUrls: ['./copy-from-other-subject-dialog.component.scss'],
})
export class CopyFromOtherSubjectDialogComponent implements OnInit {
  selectedDocumentId: 0
  documents: DocumentPreview[]
  StringHelper: any
  showSpinner: boolean

  constructor(
    public dialogRef: MatDialogRef<CopyFromOtherSubjectDialogComponent>,
    public translatePipe: TranslatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _bookService: DocumentService
  ) {
    this.documents = DocumentPreview[0]
  }

  ngOnInit() {
    this.StringHelper = StringHelper
    this.showSpinner = true
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    let currentSubject = JSON.parse(localStorage.getItem('currentSubject'))

    this._bookService
      .getAllUserMainDocuments(
        currentUser ? currentUser.id : 1,
        currentSubject ? currentSubject.id : 1
      )
      .subscribe((data) => {
        this.documents = data
        this.showSpinner = false
      })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onYesClick() {
    this.dialogRef.close({
      documentId: this.selectedDocumentId,
      subjectId: this.data.subjectId,
    })
  }
}
