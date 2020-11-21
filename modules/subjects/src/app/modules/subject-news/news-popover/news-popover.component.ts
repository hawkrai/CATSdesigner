import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../models/dialog-data.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {FileService} from '../../../services/file.service';
import {Attachment} from '../../../models/attachment.model';

@Component({
  selector: 'app-news-popover',
  templateUrl: './news-popover.component.html',
  styleUrls: ['./news-popover.component.less']
})
export class NewsPopoverComponent implements OnInit {
  public Editor = ClassicEditor;
  public files = [];
  public model;


  constructor(
    public dialogRef: MatDialogRef<NewsPopoverComponent>,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    const values = JSON.stringify(
      this.data.model.attachments.map(attachment => `${attachment.name}/${attachment.id}/${attachment.pathName}/${attachment.fileName}`
    ));

    if (values.length) {
      this.fileService.getAttachment({values, deleteValues: 'DELETE'})
        .subscribe(files => this.files = files);
    }
  }

  onSave(): void {
    this.data.model.attachments = [];
    if (this.files.length) {
      this.files.forEach(file => {
        const attachment: Attachment = {
          id: '0',
          name: file['Name'],
          attachmentType: file['Type'],
          fileName: file['GuidFileName']
        };
        this.data.model.attachments.push(attachment);
      });

    }
    this.dialogRef.close(this.data.model);
  }

  uploadFile(event) {
    this.fileService.uploadFile(event.target.files[0]).subscribe(files => {
        this.files.push(files[0]);
      }
    )
  }

  onPaste(clipboardData: DataTransfer): void {
    
    if (clipboardData.files.length > 0) {
      this.fileService.uploadFile(clipboardData.files[0])
        .subscribe(files => this.files.push(files[0]));
    }
  }

  deleteFile(file) {
    this.fileService.deleteFile(file.DeleteUrl)
      .subscribe(res => console.log(res));
  }
}
