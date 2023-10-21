import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Message } from '../../../../../../container/src/app/core/models/message'
import { Attachment } from '../../../../../complex/src/app/models/Attachment'
import { Store } from '@ngrx/store'
import { IAppState } from '../../../../../complex/src/app/store/states/app.state'
import * as filesActions from '../../service/files.actions'

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.css'],
})
export class AllNewsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AllNewsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    console.log(this.data)
  }

  public rerouteToSubject(subjectId: any) {
    const message: Message = new Message()
    message.Value = '/web/viewer/subject/' + subjectId
    message.Type = 'Route'
    this.sendMessage(message)
  }

  public sendMessage(message: Message): void {
    window.parent.postMessage(
      [{ channel: message.Type, value: message.Value }],
      '*'
    )
  }

  onCancelClick() {
    this.dialogRef.close(null)
  }

  fileDownload(attachment: Attachment) {
    this.store.dispatch(
      filesActions.downloadFile({
        pathName: attachment.PathName,
        fileName: attachment.FileName,
      })
    )
  }
}
