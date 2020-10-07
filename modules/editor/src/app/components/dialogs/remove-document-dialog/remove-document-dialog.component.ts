import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentTree } from 'src/app/models/DocumentTree';

@Component({
  selector: 'remove-document-dialog',
  templateUrl: './remove-document-dialog.component.html',
  styleUrls: ['./remove-document-dialog.component.scss']
})
export class RemoveDocumentDialogComponent {

  constructor(public dialogRef: MatDialogRef<RemoveDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDocumentTree) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
