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
          Id: this.data.Id,
          Name: this.data.Name,
          Description: this.data.Description,
          ParentId: this.data.ParentId,
          SubjectId: this.data.SubjectId,
          ParentOrder: this.data.ParentOrder,
          Text: this.data.Text,
          UserId: this.data.UserId
        });
    }
    else {
      this.nameFormControl.markAsTouched();
      this.descriptionFormControl.markAsTouched();
    }
  }
}
