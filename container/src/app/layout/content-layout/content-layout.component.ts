import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { VideoChatService } from './../../modules/video-chat/services/video-chat.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.less']
})
export class ContentLayoutComponent implements OnInit {

  constructor(
    private coreService: CoreService,
    private videoChatService :VideoChatService
  ) {

  }
  ngOnInit(): void {
    this.coreService.setupMessageCommunication();
  }

  isVideoChatAvailable():boolean {
    return this.videoChatService.isSecureConnection();
  }
}
