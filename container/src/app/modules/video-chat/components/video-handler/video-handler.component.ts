import { Component, OnInit } from '@angular/core';
import { SignalRService } from './../../../chat/shared/services/signalRSerivce';

@Component({
  selector: 'app-video-handler',
  templateUrl: './video-handler.component.html',
  styleUrls: ['./video-handler.component.less']
})
export class VideoHandlerComponent implements OnInit {

  constructor(signalService:SignalRService) { }

  ngOnInit(): void {
  }

}
