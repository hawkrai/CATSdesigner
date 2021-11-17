import { Component, OnInit } from '@angular/core';
import { SignalRService } from './../../../chat/shared/services/signalRSerivce';
import { VideoChatService } from './../../services/video-chat.service';

@Component({
  selector: 'app-video-handler',
  templateUrl: './video-handler.component.html',
  styleUrls: ['./video-handler.component.less']
})
export class VideoHandlerComponent implements OnInit {

  public IsIncomingCall: boolean = false;

  constructor(private videoChatService:VideoChatService) {
    this.videoChatService.isActiveCall.subscribe(
      () => {

      }
    );
    this.videoChatService.isIncomingCall.subscribe(
      (value: boolean) => {
        this.IsIncomingCall = value;
      }
    )
  }

  ngOnInit(): void {
  }

}
