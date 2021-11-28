import { Injectable } from '@angular/core';
import { AppToastrService } from 'src/app/core/services/toastr.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, BehaviorSubject } from 'rxjs';
import { ChatService } from '../../chat/shared/services/chatService';

@Injectable({
  providedIn: 'root',
})
export class VideoChatService {
  public currentChatId: any = null;

  public isActiveCall = new BehaviorSubject<boolean>(false);
  public isIncomingCall = new BehaviorSubject<boolean>(false);
  public chat: any;

  constructor(private chatService: ChatService) {}

  public NotifyIncomeCall(chatId: any) {
    if (this.currentChatId !== chatId) {
      if (this.isActiveCall.getValue() || this.isIncomingCall.getValue()) {
        return false;
      }
    }

    this.currentChatId = chatId;
    console.log(chatId);

    this.getChatInfo(chatId);
    this.isIncomingCall.next(true);

    return true;
  }

  public SetActiveCall(chatId: any) {
    if (this.currentChatId !== chatId) {
      if (this.isActiveCall.getValue() || this.isIncomingCall.getValue()) {
        return false;
      }
    }
    this.currentChatId = chatId;

    this.isIncomingCall.next(false);
    this.isActiveCall.next(true);

    return true;
  }

  public DisconnectUser(chatId: any, userId: any) {
    this.endCall(chatId);
  }

  public disconnectFromCall() {
    this.endCall();
  }

  public answerCall() {
    this.isIncomingCall.next(false);

    if (this.currentChatId == null) return;

    this.isActiveCall.next(true);
  }

  public getChatInfo(chatId) {
    console.log('get chat info');
    this.chatService.LoadChat(chatId).subscribe((chat: any) => {
      console.log('chat', chat);
      this.chat = chat;
    });
  }

  public endCall(chatId = null) {
    if (chatId != null) {
      if (this.currentChatId != chatId) {
        return;
      }
    }
    this.currentChatId = null;
    this.chat = null;
    this.isActiveCall.next(false);
    this.isIncomingCall.next(false);
  }

  public isChatMatch(chatId: number){
    return this.currentChatId === chatId;
  }
}
