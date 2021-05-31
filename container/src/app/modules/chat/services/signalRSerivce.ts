import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from '../index/chat.model';
import { DataService } from './dataService';
import { MessageCto } from '../Dto/messageCto';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection
  public user: any;
  constructor(private dataService: DataService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.hubConnection = new HubConnectionBuilder()
                            .withUrl('http://178.124.197.115:3000/chat')
                            .withAutomaticReconnect()
                            .build();
    this.hubConnection
      .start()
      .then(() => {
        console.log('server start signalR')
        this.join(this.user.id, this.user.role);
        this.addChatListener();
      })
      .catch(err => console.log('Error while starting connection: ' + err))

  }

  public addChatListener() {
    this.hubConnection.on('GetMessage', (message: Message) => {
      this.dataService.AddMsg(message);
    });

    this.hubConnection.on('RemovedMessage', (chatId: any, msgId: any) => {
      this.dataService.RemoveMsg(chatId, msgId);
    })
  }

  public sendMessage(msg: MessageCto) {
    this.hubConnection.invoke("SendMessage", this.user.id, JSON.stringify(msg))
  }

  public sendGroupMessage(msg: MessageCto) {
    this.hubConnection.invoke("SendGroupMessage", this.user.id, this.user.role, JSON.stringify(msg))
  }

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
      msg.fileSize = parseFloat((item.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      msg.fileContent = item.name;
      if (item.name.includes(".jpg") || item.name.includes(".png")) {
        msg.isimage = true;
      }
      else
        msg.isfile = true;
      formData.append(item.name, item);
    }
    formData.append("ChatId", this.dataService.activChatId.toString());
    this.dataService.SendImg(formData).subscribe(result=>  this.sendGroupMessage(msg))
  }

  public remove(id: any) {
    return this.hubConnection.invoke("DeleteGroupMsg", id.toString(), this.dataService.activChatId.toString());
  }

  public join(userId: number, role: string) {
    return this.hubConnection.invoke("Join", userId, role);
  }
}
