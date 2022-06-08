import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions } from '@aspnet/signalr';
import { Message } from '../models/entities/message.model';
import { DataService } from './dataService';
import { ContactService } from './contactService';
import { MessageCto } from '../models/dto/messageCto';
import { environment } from 'src/environments/environment';
import { VideoChatService } from './../../../video-chat/services/video-chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Options } from 'http-proxy-middleware';

//api methods
const SendCallRequest = 'SendCallRequest';
const DisconnectFromChat = 'DisconnectFromChat';
const SendRejection = 'Reject';
//handlers
const IncomeCall = 'HandleIncomeCall';
const DisconnectUser = 'HandleDisconnection';
const HandleRejection = 'HandleRejection';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  public hubConnection: HubConnection;
  public user: any;
  private timer: any;

  constructor(
    private dataService: DataService,
    private videoChatService: VideoChatService,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.connect();
  }


  public connect() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(
        'chatSignalR')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('server start signalR');
        this.join(this.user.id, this.user.role);
        this.addChatListener();
      })
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  public addChatListener() {
    this.hubConnection.on('GetMessage', (message: Message) => {
      this.dataService.AddMsg(message);
    });

    this.hubConnection.on('Status', (userId: number, status: boolean) => {
      this.dataService.SetStatus(userId, status);
      this.contactService.SetStatus(userId, status);
    });

    this.hubConnection.on('RemovedMessage', (chatId: any, msgId: any) => {
      this.dataService.RemoveMsg(chatId, msgId);
    });

    this.hubConnection.on(
      'EditedMessage',
      (chatId: any, msgId: any, text: any) => {
        this.dataService.updateMsg(chatId, msgId, text);
      }
    );

    this.hubConnection.on(
      'NewChat',
      (firstId: any, secondId: any, chatId: any) => {
        this.contactService.updateChats(firstId, secondId, chatId);
      }
    );

    this.hubConnection.on(IncomeCall, (chatId: any) => {
      this.setEndChatTimer(chatId, 45000);
      if (!this.videoChatService.NotifyIncomeCall(chatId)) {
        this.sendRejection(chatId, 'unable to connect');
      }
    });

    this.hubConnection.on(DisconnectUser, (chatId: any, userId: any) => {
      this.videoChatService.DisconnectUser(chatId, userId);
    });

    this.hubConnection.on(HandleRejection, (chatId: any, message: string) => {
      if (this.videoChatService.currentChatId == chatId) {
        this.reject(message);
        this.videoChatService.endCall(chatId);
      }
    });
  }

  public addChat(firstId: number, secondId: number, chatId: number) {
    return this.hubConnection.invoke('AddChat', firstId, secondId, chatId);
  }

  public updateGroupMessage(id: number, text: string, chatId: number) {
    return this.hubConnection.invoke('UpdateGroupMessage', id, text, chatId);
  }

  public updateChatMessage(id: number, text: string, chatId: number) {
    return this.hubConnection.invoke('UpdateChatMessage', id, text, chatId);
  }

  public sendMessage(msg: MessageCto) {
    return this.hubConnection.invoke(
      'SendMessage',
      this.user.id,
      JSON.stringify(msg)
    );
  }

  public sendGroupMessage(msg: MessageCto) {
    return this.hubConnection.invoke(
      'SendGroupMessage',
      this.user.id,
      this.user.role,
      JSON.stringify(msg)
    );
  }

  public sendRejection(chatId: number, message: string) {
    return this.hubConnection.invoke(SendRejection, chatId, message);
  }

  public sendCallRequest(chatId: number) {
    this.setEndChatTimer(chatId, 40000);
    this.videoChatService.SetActiveCall(chatId);
    return this.hubConnection.invoke(SendCallRequest, this.user.id, chatId);
  }

  public disconnectFromCall(chatId: any) {
    this.callWasConfirmed(chatId);
    return this.hubConnection.invoke(DisconnectFromChat, this.user.id, chatId);
  }

  public SetVoiceChatConnection(chatId: any) {
    return this.hubConnection.invoke(
      'SetVoiceChatConnection',
      chatId,
      this.user.id
    );
  }

  public reject(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  public async setEndChatTimer(chatId: any, ms: number) {
    this.clearTimer();
    this.timer = setTimeout(async () => {
      this.videoChatService.endCall(chatId);
      await this.disconnectFromCall(chatId);
    }, ms);

    this.callWasConfirmed = (localChatId: any) => {
      if (chatId == localChatId) {
        this.clearTimer();
      }
    };
  }

  private clearTimer() {
    try {
      clearTimeout(this.timer);
    } catch {}
  }

  public callWasConfirmed = (chatId: any) => {};

  public SendGroupFiles(files) {
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const formData = new FormData();
    for (var item of files) {
      var i = Math.floor(Math.log(item.size) / Math.log(k));
      var msg = new MessageCto();
      msg.userId = this.user.id;
      msg.chatId = this.dataService.activChatId;
      msg.fileSize =
        parseFloat((item.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      msg.fileContent = item.name;
      if (item.name.includes('.jpg') || item.name.includes('.png')) {
        msg.isimage = true;
      } else msg.isfile = true;
      formData.append(item.name, item);
    }
    formData.append('ChatId', this.dataService.activChatId.toString());
    this.dataService
      .SendImg(formData)
      .subscribe((result) => this.sendGroupMessage(msg));
  }

  public remove(id: any) {
    if (this.dataService.isGroupChat)
      return this.hubConnection.invoke(
        'DeleteGroupMsg',
        id.toString(),
        this.dataService.activChatId.toString()
      );
    else
      return this.hubConnection.invoke(
        'DeleteChatMsg',
        id.toString(),
        this.dataService.activChatId.toString()
      );
  }

  public join(userId: number, role: string) {
    return this.hubConnection.invoke('Join', userId, role);
  }
}
