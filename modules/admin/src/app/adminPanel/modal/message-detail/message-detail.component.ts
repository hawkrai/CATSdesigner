import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit {

  message;
  isLoad = false;
  constructor(public dialogRef: MatDialogRef<MessageDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private messageService: MessageService) { }

  ngOnInit() {
    this.loadMessage(this.data);
  }

  loadMessage(messageId) {
    this.messageService.getMessage(messageId).subscribe( result => {
      this.message = result.DisplayMessage;
      this.isLoad = true;
    });
  }

}
