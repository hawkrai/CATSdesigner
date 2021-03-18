import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentPreview } from 'src/app/models/DocumentPreview';

import 'ckeditor5-custom-build/build/translations/ru';

import * as Editor from 'ckeditor5-custom-build/build/ckeditor';
import * as StringHelper from './../../../helpers/string-helper'

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
      language: 'ru',
      removePlugins: '',
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
    this.isEnableToSave =
     (StringHelper.helper.sanitizeHtml(model.editorData).length > 0 &&
      StringHelper.helper.sanitizeHtml(model.editorData).length < 256);
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
