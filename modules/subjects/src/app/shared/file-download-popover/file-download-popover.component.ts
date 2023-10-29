import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Attachment } from 'src/app/models/file/attachment.model'
import { DialogData } from '../../models/dialog-data.model'

@Component({
  selector: 'app-file-download-popover',
  templateUrl: 'file-download-popover.component.html',
  styleUrls: ['./file-download-popover.component.less'],
})
export class FileDownloadPopoverComponent {
  attachments: Attachment[] = []
  constructor(
    public dialogRef: MatDialogRef<FileDownloadPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.attachments = [...this.data.body.map((b) => ({ ...b }))]
  }

  download(): void {
    this.dialogRef.close(this.attachments.filter((a) => (a as any).isDownload))
  }

  get downloadDisabled() {
    return !this.attachments.some((x) => (x as any).isDownload)
  }
}
