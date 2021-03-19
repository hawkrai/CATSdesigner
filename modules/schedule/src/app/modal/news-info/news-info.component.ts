import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Message} from '../../../../../../container/src/app/core/models/message';
import {ModuleCommunicationService} from 'test-mipe-bntu-schedule';
import {Attachment} from '../../../../../subjects/src/app/models/file/attachment.model';

@Component({
  selector: 'app-news-info',
  templateUrl: './news-info.component.html',
  styleUrls: ['./news-info.component.css'],
})
export class NewsInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewsInfoComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any, private modulecommunicationservice: ModuleCommunicationService) {
  }

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

  fileDownload(attachment: Attachment) {
  }
}
