import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../models/dialog-data.model';
import {FileService} from '../../../../services/file.service';
import {Attachment} from '../../../../models/attachment.model';

@Component({
  selector: 'app-lecture-popover',
  templateUrl: './lecture-popover.component.html',
  styleUrls: ['./lecture-popover.component.less']
})
export class LecturePopoverComponent implements AfterViewInit {

  public files = [];

  constructor(
    public dialogRef: MatDialogRef<LecturePopoverComponent>,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
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

  onClick(): void {
    this.dialogRef.close();
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
