import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileService} from '../../../../services/file.service';
import {DialogData} from '../../../../models/dialog-data.model';
import {Attachment} from '../../../../models/attachment.model';


@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './practical-lesson-popover.component.html',
  styleUrls: ['./practical-lesson-popover.component.less']
})
export class PracticalLessonPopoverComponent implements AfterViewInit {

  public files = [];

  constructor(
    public dialogRef: MatDialogRef<PracticalLessonPopoverComponent>,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

  ngAfterViewInit(): void {
    let values = '["';
    this.data.model.attachments.forEach((attachment, index) => {
      values += attachment.Name + '/' + attachment.Id + '/' + attachment.PathName + '/' +
        attachment.FileName;
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
