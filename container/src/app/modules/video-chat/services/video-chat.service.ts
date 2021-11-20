import { Injectable } from '@angular/core';
import { AppToastrService } from 'src/app/core/services/toastr.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoChatService {
  public currentChatId: any = null;

  public isActiveCall = new BehaviorSubject<boolean>(false);
  public isIncomingCall = new BehaviorSubject<boolean>(false);

  constructor() {}

  public NotifyIncomeCall(chatId: any) {
    if (this.isActiveCall.getValue()) {
      return;
    }
    this.currentChatId = chatId;
    console.log(chatId)
    this.isIncomingCall.next(true);
  }

  public SetActiveCall(chatId: any) {
    this.currentChatId = chatId;

    this.isIncomingCall.next(false);
    this.isActiveCall.next(true);
  }

  public DisconnectUser(chatId: any, userId: any) {
    this.currentChatId = null;
    this.isIncomingCall.next(false);
    this.isActiveCall.next(false);
  }

  public disconnectFromCall() {
    this.currentChatId = null
    this.isActiveCall.next(false);
    this.isIncomingCall.next(false);
  }

  public answerCall(){
    this.isIncomingCall.next(false);

    if(this.currentChatId == null)
      return;

    this.isActiveCall.next(true);
  }
}