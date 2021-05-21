import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { Message } from './chat.model';

import { DataService } from '../services/dataService';
import { Chats } from '../tabs/chats/chats.model';
import { SignalRService } from '../services/signalRSerivce';
import { MessageCto } from '../Dto/messageCto';
import { UploadComponent } from '../tabs/upload/upload.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

  activetab = 2;
  Messages: Message[];
  currentMsg:MessageCto=new MessageCto();
  chat:Chats;
  signalR:SignalRService;
  constructor(private router: Router,public dialog: MatDialog,public signalRService:SignalRService,public dataService:DataService) { }

  ngOnInit(): void {
    this.currentMsg.text="";
    this.signalR=this.signalRService;
    this.signalR.startConnection(this.dataService);
    this.Messages = this.dataService.msg;
    console.log("info")
    this.chat=this.dataService.activChat;
  }

  openDialog() {
    const dialogRef = this.dialog.open(UploadComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.signalRService.SendGroupFiles();
    });
  }

  download(filename:string)
  {
    this.dataService.downloadFile(filename);
  }

  remove(id : any)
  {
    this.signalRService.remove(id);
  }

  sendMsg()
  {
    this.currentMsg.userId=this.dataService.user.id;
    this.currentMsg.chatId=this.dataService.activChat.id;
    console.log(this.currentMsg)
    if (this.dataService.isActivGroup)
      this.signalR.sendGroupMessage(this.currentMsg);
    else
      this.signalR.sendMessage(this.currentMsg);
    this.currentMsg.text="";
  }

  showUserProfile() {
    document.getElementById('profile-detail').style.display = 'block';
  }

  /**
   * Close user chat
   */
  // tslint:disable-next-line: typedef
  closeUserChat() {
    document.getElementById('chat-room').classList.remove('user-chat-show');
  }

  /**
   * Logout the user
   */
  logout() {
  }
}
