import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileService } from 'src/app/service/file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = {percentage: 0};

  constructor(private uploadService: FileService, public dialogRef: MatDialogRef<SendMessageComponent>) { }

  ngOnInit() {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
}

upload() {
    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
            console.log('file is completely uploaded!');
        }
    }, error => {
        if (error.status === 409) {
            error.message = 'This document already exist';
        }
        if ( error.status === 400) {
            error.message = 'This format doesn\'t support';
        }
        if (error.status === 404) {
            error.message = 'Documents contains wrong tags';
        }
        throw error;
    });

    this.selectedFiles = undefined;
}

}
