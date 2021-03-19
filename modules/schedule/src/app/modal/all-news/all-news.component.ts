import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Message} from '../../../../../../container/src/app/core/models/message';
import {Attachment} from '../../../../../subjects/src/app/models/file/attachment.model';
import * as filesActions from '../../../../../subjects/src/app/store/actions/files.actions';


@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.css']
})
export class AllNewsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AllNewsComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any ) { }


  ngOnInit() {
  }

  public rerouteToSubject() {
    const message: Message = new Message();
    message.Value = '/Subject?subjectId=' + this.data.itemNews.SubjectId;
    message.Type = 'Route';
    this.sendMessage(message);
  }

  public sendMessage(message: Message): void {
    window.parent.postMessage([{channel: message.Type, value: message.Value}], '*');
  }

  onCancelClick() {
    this.dialogRef.close(null);
  }

  fileDownload(attachment: Attachment) {
  }
}
