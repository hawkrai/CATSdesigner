import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentPreview } from 'src/app/models/DocumentPreview';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import * as Editor from 'ckeditor5-custom-build/build/ckeditor';

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

  description: string;
  isEnableToSave: boolean;

  //Text editor
  public editor = Editor;
  isEditorModelChanged: boolean;
  public model = {
    editorData: '',
    config: {
      placeholder: 'Введите содержание здесь...',
      toolbar: [ 'heading',
        '|', 'bold', 'italic', 'link', 'alignment',
        '|', 'fontBackgroundColor', 'fontColor', 'fontSize', 'fontFamily',
        '|', 'indent', 'outdent',
        '|', 'blockQuote', // 'ckfinder',
        '|', 'MathType',
        '|', 'undo', 'redo' ],
    }
  }

  constructor(public dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentPreview) { }

  ngOnInit() {
    this.description = this.data.ParentId && this.data.ParentId != 0 ? "новой темы" : "нового учебника";
    this.isEnableToSave = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onModelChanged(model) {
    this.isEnableToSave = (model.editorData.replace(/<[^>]+>/g, '').length > 0 && model.editorData.replace(/<[^>]+>/g, '').length < 256) ? true : false;
  }

  onYesClick() {
    if(this.isEnableToSave) {
        this.dialogRef.close({
          Id: this.data.Id,
          Name: this.model.editorData,
          ParentId: this.data.ParentId,
          SubjectId: this.data.SubjectId,
          ParentOrder: this.data.ParentOrder,
          Text: this.data.Text,
          UserId: this.data.UserId
        });
    }
  }
}
