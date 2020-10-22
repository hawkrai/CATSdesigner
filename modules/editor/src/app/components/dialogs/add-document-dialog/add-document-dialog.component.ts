import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentPreview } from 'src/app/models/DocumentPreview';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

export class DocumentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.scss']
})

export class AddDocumentDialogComponent implements OnInit {

  nameFormControl = new FormControl('', [
    Validators.required
  ]);

  descriptionFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new DocumentErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentPreview) { }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    if(this.data.Name && this.data.Description &&
      this.data.Name.length > 0 && this.data.Name.length < 256 &&
      this.data.Description.length > 0 && this.data.Description.length < 256) {
        this.dialogRef.close({
          id: this.data.Id,
          name: this.data.Name,
          description: this.data.Description,
          parentId: this.data.ParentId,
          subjectId: this.data.SubjectId,
          parentOrder: this.data.ParentOrder,
          text: this.data.Text
        });
    }
    else {
      this.nameFormControl.markAsTouched();
      this.descriptionFormControl.markAsTouched();
    }
  }
}
