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

  description: string;
  isEnableToSave: boolean;

  constructor(public dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentPreview) { }

  ngOnInit() {
    this.description = this.data.ParentId && this.data.ParentId != 0 ? "новой темы" : "нового учебника";
    this.isEnableToSave = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onModelChanged(newLine) {
    this.isEnableToSave = (newLine.length > 0 && newLine.length < 256) ? true : false;
  }

  onYesClick() {
    if(this.isEnableToSave) {
        this.dialogRef.close({
          Id: this.data.Id,
          Name: this.data.Name,
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
