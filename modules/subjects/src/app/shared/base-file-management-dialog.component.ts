import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { DialogData } from '../models/dialog-data.model';
import { AttachedFile } from '../models/file/attached-file.model';
import { IAppState } from '../store/state/app.state';
import * as filesActions from '../store/actions/files.actions';
import * as filesSelectors from '../store/selectors/files.selectors';

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
        if (this.data.model.attachments) {
            const values = JSON.stringify(
                this.data.model.attachments.map(attachment => `${attachment.name}/${attachment.id}/${attachment.pathName}/${attachment.fileName}`
            ));
            this.store.dispatch(filesActions.loadAttachments({ values }));
            this.files$ = this.store.select(filesSelectors.getFiles);
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch(filesActions.reset());
    }


    onSave(files: AttachedFile[]): void {
        this.data.model.attachments = files
        .map(f => ({ id: f.IdFile > 0 ? f.IdFile : 0 , name: f.Name, attachmentType: f.Type, fileName: f.GuidFileName}));
        this.dialogRef.close(this.data.model);
    }

    uploadFile(file: File) {
        this.store.dispatch(filesActions.uploadFile({ file }));
    }

    onClose(files: AttachedFile[], toSave: boolean): void {
        if (toSave) {
            this.onSave(files);
        } else {
            files.filter(f => f.IdFile <= 0)
            .forEach(f => this.deleteFile(f));
            this.dialogRef.close();
        }
    }

    deleteFile(file: AttachedFile) {
        this.store.dispatch(filesActions.deleteFile({ file }));

    }
}