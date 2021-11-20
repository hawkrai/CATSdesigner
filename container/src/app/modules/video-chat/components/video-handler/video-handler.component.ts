import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/modules/chat/shared/services/dataService';
import { StreamHandlerComponent } from '../stream-handler/stream-handler.component';
import { SignalRService } from './../../../chat/shared/services/signalRSerivce';
import { VideoChatService } from './../../services/video-chat.service';

@Component({
  selector: 'app-video-handler',
  templateUrl: './video-handler.component.html',
  styleUrls: ['./video-handler.component.less'],
})
export class VideoHandlerComponent implements OnInit {

  @ViewChild('child') child:StreamHandlerComponent

  public IsIncomingCall: boolean = false;
  public IsActiveCall: boolean = false;
  public IsMicroActive: boolean = false;
  public isVideoActive: boolean = false;

  constructor(
    private videoChatService: VideoChatService,
    private signalRService: SignalRService,
    public dataService: DataService
  ) {
    this.videoChatService.isActiveCall.subscribe((value: boolean) => {
      this.IsActiveCall = value;
    });
    this.videoChatService.isIncomingCall.subscribe((value: boolean) => {
      this.IsIncomingCall = value;
    });
  }

  ngOnInit(): void {}

  answerCall() {
    console.log('The call was answered');
    this.videoChatService.answerCall();
    this.signalRService.SetVoiceChatConnection(this.videoChatService.currentChatId);
  }

  endCall() {
    console.log(this.videoChatService.currentChatId)
    this.signalRService.disconnectFromCall(this.videoChatService.currentChatId);
    this.videoChatService.disconnectFromCall();
  }

  switchMicro() {
    this.IsMicroActive = !this.IsMicroActive
    this.child.changeMicroStatus(this.IsMicroActive);
  }

  switchVideo() {
    this.isVideoActive = !this.isVideoActive;
    this.child.changeVideoStatus(this.isVideoActive);
  }
}