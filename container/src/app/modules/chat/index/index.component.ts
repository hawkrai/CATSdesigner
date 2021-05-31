import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Message } from './chat.model';

import { DataService } from '../services/dataService';
import { Chat } from '../tabs/chats/chats.model';
import { SignalRService } from '../services/signalRSerivce';
import { MessageCto } from '../Dto/messageCto';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { FileService } from '../services/files.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class IndexComponent implements OnInit {
  activetab = 2;
  currentMsg: MessageCto = new MessageCto();
  chat: Chat;
  constructor(private cdr: ChangeDetectorRef,private router: Router, public dialog: MatDialog, public signalRService: SignalRService, public dataService: DataService, public fileService : FileService) { }
  
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  messages: Message[];
    
  ngOnInit(): void {
    this.dataService.messages.subscribe((msgs:Message[]) => {
      this.messages=msgs;
      this.cdr.detectChanges();
      this.componentRef.directiveRef.scrollToBottom();
    });
    
    this.currentMsg.text = "";
  }
  
  uploadFiles(event) {
    if (event.files)
      this.fileService.UploadFile(event.files)
  }

  download(filename: string) {
    this.fileService.DownloadFile(filename);
  }

  remove(id: any) {
    this.signalRService.remove(id);
  }

  sendMsg() {
    this.currentMsg.userId = this.dataService.user.id;
    this.currentMsg.chatId=this.dataService.activChatId;
    if (this.dataService.isGroupChat)
      {
        this.signalRService.sendGroupMessage(this.currentMsg);
      }
    else
      this.signalRService.sendMessage(this.currentMsg);
    this.currentMsg.text = "";
  }

  closeUserChat() {
    document.getElementById('chat-room').classList.remove('user-chat-show');
  }
}
