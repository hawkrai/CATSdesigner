import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { AttachedFile } from '../../../../models/AttachedFile';
import { IAppState } from '../../../../store/states/app.state';
import { DialogData } from '../../../../models/DialogData';
import * as filesActions from '../../../../store/actions/files.actions';
import * as filesSelectors from '../../../../store/selectors/files.selector';


export class BaseFileManagementComponent<T> implements OnInit, OnDestroy {
  public files$: Observable<AttachedFile[]>;

  constructor(
    protected dialogRef: MatDialogRef<T>,
    protected store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogData
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.data.attachments) {
      const values = JSON.stringify(
        this.data.attachments.map(attachment => `${attachment.name}/${attachment.id}/${attachment.pathName}/${attachment.fileName}`
        ));
      this.store.dispatch(filesActions.loadAttachments({ values }));
      this.files$ = this.store.select(filesSelectors.getFiles);
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(filesActions.reset());
  }


  onSave(files: AttachedFile[]): void {
    this.data.attachments = files
      .map(f => ({ id: f.IdFile > 0 ? f.IdFile : 0, name: f.Name, attachmentType: f.Type, fileName: f.GuidFileName }));
    this.dialogRef.close(this.data);
  }

  uploadFile(file: File) {
    this.store.dispatch(filesActions.uploadFile({ file }));
  }

  onClose(files: AttachedFile[], toSave: boolean): void {
    if (toSave) {
      this.onSave(files);
    } else {
      if (files) {
        files.filter(f => f.IdFile <= 0)
          .forEach(f => this.deleteFile(f));
      }
      this.dialogRef.close();
    }
  }

  deleteFile(file: AttachedFile) {
    this.store.dispatch(filesActions.deleteFile({ file }));
  }
}
