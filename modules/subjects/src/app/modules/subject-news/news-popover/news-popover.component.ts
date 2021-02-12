import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { BaseFileManagementComponent } from './../../../shared/base-file-management-dialog.component';
import {DialogData} from '../../../models/dialog-data.model';
import * as filesActions from '../../../store/actions/files.actions';
import { IAppState } from 'src/app/store/state/app.state';

@Component({
  selector: 'app-news-popover',
  templateUrl: './news-popover.component.html',
  styleUrls: ['./news-popover.component.less']
})
export class NewsPopoverComponent extends BaseFileManagementComponent<NewsPopoverComponent> {
  public Editor = ClassicEditor;

  constructor(
    dialogRef: MatDialogRef<NewsPopoverComponent>,
    store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) data: DialogData) {
    super(dialogRef, store, data)
  }

  onPaste(clipboardData: DataTransfer): void {
    if (clipboardData.files.length > 0) {
      this.store.dispatch(filesActions.uploadFile({ file: clipboardData.files[0] }));
    }
  }

}
