import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { DataService } from 'src/app/modules/chat/shared/services/dataService'
import { StreamHandlerComponent } from '../stream-handler/stream-handler.component'
import { SignalRService } from './../../../chat/shared/services/signalRSerivce'
import { VideoChatService } from './../../services/video-chat.service'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-video-handler',
  templateUrl: './video-handler.component.html',
  styleUrls: ['./video-handler.component.scss'],
})
export class VideoHandlerComponent implements OnInit, OnDestroy {
  @ViewChild('child') child: StreamHandlerComponent

  public IsIncomingCall: boolean = false
  public IsActiveCall: boolean = false
  public IsMicroActive: boolean = false
  public isVideoActive: boolean = false
  public IsCallAccepted: boolean = false

  constructor(
    public videoChatService: VideoChatService,
    private signalRService: SignalRService,
    public dataService: DataService,
    public http: HttpClient
  ) {
    this.videoChatService.isActiveCall.subscribe((value: boolean) => {
      this.IsActiveCall = value
    })
    this.videoChatService.isIncomingCall.subscribe((value: boolean) => {
      this.IsIncomingCall = value
    })
  }

  ngOnDestroy(): void {
    this.endCall()
  }

  ngOnInit(): void {}

  answerCall() {
    this.IsCallAccepted = this.videoChatService.answerCall()
    this.signalRService.SetVoiceChatConnection(
      this.videoChatService.currentChatId
    )
    this.stopCallSound('incomingCallSound');
  }

  endCall() {
    if (!this.IsActiveCall && !this.IsIncomingCall) {
      return
    }

    this.signalRService.disconnectFromCall(this.videoChatService.currentChatId)
    this.videoChatService.disconnectFromCall()
  }

    stopCallSound(id: string){
    const callsound = document.getElementById(id) as HTMLAudioElement;
    callsound.pause();
  }

  switchMicro() {
    this.IsMicroActive = !this.IsMicroActive
  }

  switchVideo() {
    this.isVideoActive = !this.isVideoActive
  }

  clientDisconnected() {
    this.endCall()
  }
}
