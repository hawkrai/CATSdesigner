import { Injectable } from '@angular/core';
import { AppToastrService } from 'src/app/core/services/toastr.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {

  public isActiveCall = new BehaviorSubject<boolean>(false);
  public isIncomingCall = new BehaviorSubject<boolean>(false);

  constructor(private toastrService:AppToastrService) {
  }

  public NotifyIncomeCall(chatId: any){

    if(this.isActiveCall.getValue()){
      return;
    }
    this.isIncomingCall.next(true);
  }

  public EndCallNotification(chatId: any){
    this.isIncomingCall.next(true);
  }

  public SetActiveCall(chatId: any){
    this.isActiveCall.next(true);
  }
}
