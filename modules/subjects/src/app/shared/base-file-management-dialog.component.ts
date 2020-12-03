import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogData } from '../models/dialog-data.model';
import { FileService } from '../services/file.service';
import { AttachedFile } from '../models/attached-file.model';


export class BaseFileManagementComponent<T> implements OnInit {
    public files: AttachedFile[] = [];

    constructor(
        protected dialogRef: MatDialogRef<T>,
        protected fileService: FileService,
        @Inject(MAT_DIALOG_DATA) protected data: DialogData
    ) {}

    ngOnInit(): void {
        const values = JSON.stringify(
          this.data.model.attachments.map(attachment => `${attachment.name}/${attachment.id}/${attachment.pathName}/${attachment.fileName}`
        ));
    
        if (values.length) {
          this.fileService.getAttachment({values, deleteValues: 'DELETE'})
            .subscribe(files => {
              this.files = files
            });
        }
    }


    onSave(): void {
        this.data.model.attachments = this.files
        .map(f => ({ id: f.IdFile > 0 ? f.IdFile : 0 , name: f.Name, attachmentType: f.Type, fileName: f.GuidFileName}));
        this.dialogRef.close(this.data.model);
    }

    uploadFile(file: File) {
        const index = this.files.length;
        this.files.push(null);
        this.fileService.uploadFile(file).subscribe(files => {
            this.files[index] = files[0];
        }, () => this.files.splice(index, 1));
    }

    onClose(): void {
        this.files.filter(f => f.IdFile <= 0)
        .forEach(f => this.deleteFile(f));
        this.dialogRef.close();
    }

    deleteFile(file: AttachedFile) {
        console.log(file)
        this.fileService.deleteFile(file.DeleteUrl)
        .subscribe(res => console.log(res));
    }
}