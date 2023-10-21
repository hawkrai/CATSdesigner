import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Message } from '../../../../../../container/src/app/core/models/message'
import * as filesActions from '../../service/files.actions'
import { Store } from '@ngrx/store'
import { IAppState } from '../../../../../complex/src/app/store/states/app.state'
import { Attachment } from '../../../../../complex/src/app/models/Attachment'

@Component({
  selector: 'app-news-info',
  templateUrl: './news-info.component.html',
  styleUrls: ['./news-info.component.css'],
})
export class NewsInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<NewsInfoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {}

  public rerouteToSubject() {
    const message: Message = new Message()
    message.Value = '/web/viewer/subject/' + this.data.itemNews.SubjectId
    message.Type = 'Route'
    this.sendMessage(message)
  }

  public sendMessage(message: Message): void {
    window.parent.postMessage(
      [{ channel: message.Type, value: message.Value }],
      '*'
    )
  }

  fileDownload(attachment: Attachment) {
    this.store.dispatch(
      filesActions.downloadFile({
        pathName: attachment.PathName,
        fileName: attachment.FileName,
      })
    )
  }

  onCancelClick() {
    this.dialogRef.close(null)
  }
}
