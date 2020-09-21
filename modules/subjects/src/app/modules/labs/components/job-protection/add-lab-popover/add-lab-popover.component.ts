import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../../models/dialog-data.model';
import {FileService} from '../../../../../services/file.service';


@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './add-lab-popover.component.html',
  styleUrls: ['./add-lab-popover.component.less']
})
export class AddLabPopoverComponent implements AfterViewInit {

  public files = [];

  constructor(
    public dialogRef: MatDialogRef<AddLabPopoverComponent>,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

  ngAfterViewInit(): void {
    let values = '["';
    this.data.body.attachments.forEach((attachment, index) => {
      values += attachment.Name + '/' + attachment.Id + '/' + attachment.PathName + '/' +
        attachment.FileName;
      if (index < this.data.body.attachments.length - 1) {
        values += '","'
      }
    });

    values += '"]';

    if (this.data.body.attachments.length) {
      this.fileService.getAttachment({values, deleteValues: 'DELETE'})
        .subscribe(files => this.files = files);
    }
  }

  onClick(): void {
    this.dialogRef.close();
  }

  onSave(data): void {
    this.data.body.attachments = [];
    if (this.files.length) {
      this.files.forEach(file => {
        const attachment = {
          Id: '0',
          Name: file['Name'],
          AttachmentType: file['Type'],
          FileName: file['GuidFileName']
        };
        this.data.body.attachments.push(attachment);
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
