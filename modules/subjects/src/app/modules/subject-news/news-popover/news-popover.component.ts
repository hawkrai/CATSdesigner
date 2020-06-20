import {AfterViewInit, Component, Inject} from '@angular/core';
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
export class NewsPopoverComponent implements AfterViewInit{
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

  ngAfterViewInit(): void {
    let values = '["';
    this.data.model.attachments.forEach((attachment, index) => {
      values += attachment.name + '/' + attachment.id + '/' + attachment.pathName + '/' +
        attachment.fileName;
      if (index < this.data.model.attachments.length - 1) {
        values += '","'
      }
    });

    values += '"]';

    if (this.data.model.attachments.length) {
      this.fileService.getAttachment({values, deleteValues: 'DELETE'})
        .subscribe(files => this.files = files);
    }
  }

  onSave(data): void {
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
    this.dialogRef.close(data)
  }

  uploadFile(event) {
    this.fileService.uploadFile(event.target.files[0]).subscribe(files => {
        this.files.push(files[0]);
      }
    )
  }

  deleteFile(file) {
    this.fileService.deleteFile(file.DeleteUrl)
      .subscribe(res => console.log(res));
  }
}
