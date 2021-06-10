import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentPreview } from 'src/app/models/DocumentPreview';
import { DocumentService } from 'src/app/services/document.service';
import { TranslatePipe } from '../../../../../../../container/src/app/pipe/translate.pipe';

@Component({
  selector: 'app-copy-to-other-subject-dialog',
  templateUrl: './copy-to-other-subject-dialog.component.html',
  styleUrls: ['./copy-to-other-subject-dialog.component.scss']
})
export class CopyToOtherSubjectDialogComponent implements OnInit {

  selectedSubjectId: 0;
  subjects: [];
  showSpinner: boolean;

  constructor(public dialogRef: MatDialogRef<CopyToOtherSubjectDialogComponent>,
    public translatePipe: TranslatePipe,
    @Inject(MAT_DIALOG_DATA) public data: DocumentPreview,
    private _bookService: DocumentService) { }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.showSpinner = true;
    this._bookService.getUserSubjects(currentUser ? currentUser.id : 1).subscribe(data => {
      this.subjects = data.Subjects;
      this.showSpinner = false;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.dialogRef.close({
      documentId: this.data.Id,
      subjectId: this.selectedSubjectId,
    });
  }
}
