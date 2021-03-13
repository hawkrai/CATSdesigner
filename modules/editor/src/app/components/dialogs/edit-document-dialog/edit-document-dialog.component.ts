import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentPreview } from 'src/app/models/DocumentPreview';

import 'ckeditor5-custom-build/build/translations/ru';
import 'ckeditor5-custom-build/build/translations/en-gb';

import * as Editor from 'ckeditor5-custom-build/build/ckeditor';
import * as StringHelper from './../../../helpers/string-helper'
import { TranslatePipe } from '../../../../../../../container/src/app/pipe/translate.pipe';

@Component({
  selector: 'app-edit-document-dialog',
  templateUrl: './edit-document-dialog.component.html',
  styleUrls: ['./edit-document-dialog.component.scss']
})
export class EditDocumentDialogComponent implements OnInit {

  //Text editor
  public editor = Editor;
  isEditorModelChanged: boolean;
  public model = {
    editorData: '',
    config: {
      placeholder: this.translatePipe.transform('text.editor.hint.enter.content.here',"Введите содержимое здесь..."),
      language: StringHelper.helper.transformLanguageLine(localStorage.getItem("locale") ?? "ru"),
      toolbar: [ 'heading',
        '|', 'bold', 'italic', 'link', 'alignment',
        '|', 'fontBackgroundColor', 'fontColor', 'fontSize', 'fontFamily',
        '|', 'indent', 'outdent',
        '|', 'blockQuote', // 'ckfinder',
        '|', 'MathType',
        '|', 'undo', 'redo' ],
    }
  }

  isEnableToSave: boolean;
  oldName: string;
  description: string;

  constructor(public dialogRef: MatDialogRef<EditDocumentDialogComponent>,
    public translatePipe: TranslatePipe,
    @Inject(MAT_DIALOG_DATA) public data: DocumentPreview) { }

  ngOnInit() {
    this.isEnableToSave = false;
    this.oldName = this.model.editorData = this.data.Name;
    this.description = this.data.ParentId && this.data.ParentId != 0 ?
      this.translatePipe.transform('text.editor.edit.theme',"Редактирование темы") :
      this.translatePipe.transform('text.editor.edit.book',"Редактирование учебника");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onModelChanged(model) {
    this.isEnableToSave =
     (StringHelper.helper.sanitizeHtml(model.editorData).length > 0 &&
      StringHelper.helper.sanitizeHtml(model.editorData).length < 256 &&
      this.oldName != model.editorData);
  }

  onYesClick() {
    if(this.isEnableToSave) {
        this.dialogRef.close({
          Id: this.data.Id,
          Name: this.model.editorData,
          ParentId: this.data.ParentId,
          SubjectId: this.data.SubjectId,
          ParentOrder: this.data.ParentOrder,
          UserId: this.data.UserId,
          Text: this.data.Text
        });
    }
  }

}
