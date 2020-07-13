import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LabFilesService} from '../../../services/lab-files-service';
import {FileInfo} from '../../../models/file-info.model';
import {Attachment} from '../../../models/attachment.model';

export interface DialogData {
  title: string;
  body?: {
    comments: string;
    attachments: Attachment[];
    uploadedFile: FileInfo;
  };
  buttonText: string;
  model?: any;
}

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-job-dialog.component.html',
  styleUrls: ['./add-job-dialog.component.less']
})
export class AddJobDialogComponent implements AfterViewInit {

  constructor(
    private labFilesService: LabFilesService,
    public dialogRef: MatDialogRef<AddJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngAfterViewInit(): void {
    const attachment = this.data.body.attachments[0];
    if (attachment) {
      this.labFilesService.getAttachment({values: '["' + attachment.Name + '/' + attachment.Id + '/' + attachment.PathName + '/' +
          attachment.FileName + '"]',
        deleteValues: 'DELETE'})
        .subscribe(res => this.data.body.uploadedFile = res[0]);
    }
  }

  onClick(): void {
    this.dialogRef.close();
  }

  addFile() {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', event => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files[0];
      this.labFilesService.uploadFile(selectedFile)
        .subscribe(res => this.data.body.uploadedFile = res[0]);
      fileInput = null;
    });
    fileInput.click();
  }

  deleteFile() {
    this.labFilesService.deleteFile(this.data.body.uploadedFile.DeleteUrl)
      .subscribe(() => this.data.body.uploadedFile = null);
  }

  onPaste(clipboardData: DataTransfer): void {
    if (clipboardData.files.length > 0) {
      this.labFilesService.uploadFile(clipboardData.files[0])
        .subscribe(res => this.data.body.uploadedFile = res[0]);
    }
  }

}
