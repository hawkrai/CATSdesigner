import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SendMessageComponent } from '../modal/send-message/send-message.component';
import { MessageService } from 'src/app/service/message.service';
import { MessageDetailComponent } from '../modal/message-detail/message-detail.component';
import { DeleteItemComponent } from '../modal/delete-person/delete-person.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  isLoad = false;
  messages;
  id;
  outboxColumns = ['icon', 'fullName', 'subject', 'text', 'date', 'action'];
  inboxColumns = ['icon', 'author', 'subject', 'text', 'date', 'action'];

  constructor(private dialog: MatDialog, private messageService: MessageService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages().subscribe( result => {
      this.messages = result;
      this.isLoad = true;
    });
  }

  sendMessage() {
    const dialogRef = this.dialog.open(SendMessageComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.loadMessages();
      }
    });
  }

  openMessageDetails(elementId, mode) {
    const dialogRef = this.dialog.open(MessageDetailComponent, {
      data: {
        elementId, mode
      }
    });
    dialogRef.afterClosed();
  }


  deleteMessage(messageId) {
    const dialogRef = this.dialog.open(DeleteItemComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messageService.deleteMessage(messageId).subscribe( () => {
          this.loadMessages();
        });
      }
    });
  }
}
