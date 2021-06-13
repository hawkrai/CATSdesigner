import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Message } from './chat.model';

import { DataService } from '../services/dataService';
import { Chat } from '../tabs/chats/chats.model';
import { SignalRService } from '../services/signalRSerivce';
import { MessageCto } from '../Dto/messageCto';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { FileService } from '../services/files.service';
import { ContactService } from '../services/contactService';
import { GroupListComponent } from '../tabs/GroupList/groupList.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})

export class IndexComponent implements OnInit {
  activetab = 2;
  currentMsg: MessageCto = new MessageCto();
  chat: Chat;
  filterValue: string;
  isfilter: boolean;
  messages: Message[];
  messagesAll: Message[];
  isEdit: boolean;
  editedMsg: Message;

  constructor(private cdr: ChangeDetectorRef, private clipboardApi: ClipboardService, private snackBar: MatSnackBar, private contactService: ContactService, private router: Router, public dialog: MatDialog, public signalRService: SignalRService, public dataService: DataService, public fileService: FileService) { }

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  ngOnInit(): void {
    this.contactService.loadContacts('*');
    this.dataService.messages.subscribe((msgs: Message[]) => {
      this.messages = msgs;
      this.messagesAll = msgs;
      this.cdr.detectChanges();
      if (this.messages.length)
        this.componentRef.directiveRef.scrollToBottom();
    });

    this.currentMsg.text = "";
  }

  openFilter() {
    this.isfilter = !this.isfilter;
    if (!this.isfilter) {
      this.filterValue = "";
      this.messages = this.dataService.messages.getValue();
      this.cdr.detectChanges();
      if (this.messages.length)
        this.componentRef.directiveRef.scrollToBottom();
    }
  }

  copyText(text: string) {
    this.clipboardApi.copyFromContent(text);
  }

  edit(msg: Message) {
    this.isEdit = true;
    this.editedMsg = msg;
    this.currentMsg.text = msg.text;
  }

  stopEdit() {
    this.isEdit = false;
    this.currentMsg=new MessageCto();
    this.currentMsg.text="";
    this.editedMsg = null;
  }

  filter() {
    this.messages = this.messagesAll.filter(x => x.text?.includes(this.filterValue));
    this.cdr.detectChanges();
    if (this.messages.length)
      this.componentRef.directiveRef.scrollToBottom();
  }

  openStudentsList() {
    if (this.dataService.isGroupChat && this.dataService.activChat.groupId) {
      const dialogRef = this.dialog.open(GroupListComponent, {
        width: "700px",
        data: this.dataService.activChat.groupId
      });
    }
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
    if (this.isEdit && this.currentMsg?.text && this.currentMsg.text != "") {
      if (this.dataService.isGroupChat) {
        this.signalRService.updateGroupMessage(this.editedMsg.id, this.currentMsg.text, this.dataService.activChatId)
        .then(
          res => {
            this.currentMsg.text = "";
            this.stopEdit();
            this.cdr.detectChanges();
            this.openSnackBar("Сообщение изменено");
          },
          err => {
            this.openSnackBar("Ошибка отправки");
            this.signalRService.connect();
          })
      }
      else {
        this.signalRService.updateChatMessage(this.editedMsg.id, this.currentMsg.text, this.dataService.activChatId)
          .then(
            res => {
              this.currentMsg.text = "";
              this.cdr.detectChanges();
              this.openSnackBar("Сообщение изменено");
            },
            err => {
              this.openSnackBar("Ошибка отправки");
              this.signalRService.connect();
            })
      }
    }
    else {
      if (this.currentMsg?.text && this.currentMsg.text != "") {
        this.currentMsg.userId = this.dataService.user.id;
        this.currentMsg.chatId = this.dataService.activChatId;
        if (this.dataService.isGroupChat) {
          this.signalRService.sendGroupMessage(this.currentMsg).then(
            res => {
              this.currentMsg.text = "";
              this.cdr.detectChanges();
              this.openSnackBar("Сообщение отправлено");
            },
            err => {
              this.openSnackBar("Ошибка отправки");
              this.signalRService.connect();
            })
          this.dataService.groupRead();
        }
        else {
          this.signalRService.sendMessage(this.currentMsg).then(
            res => {
              this.currentMsg.text = "";
              this.cdr.detectChanges();
              this.openSnackBar("Сообщение отправлено");
            },
            err => {
              this.openSnackBar("Ошибка отправки");
              this.signalRService.connect();
            })
          this.dataService.updateRead();
        }
      }
    }
  }

  closeUserChat() {
    document.getElementById('chat-room').classList.remove('user-chat-show');
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
