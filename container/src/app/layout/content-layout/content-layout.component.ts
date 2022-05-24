import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.less']
})
export class ContentLayoutComponent implements OnInit {
  
  constructor(
    private coreService: CoreService,
    private notificationService: NotificationService
  ) {

  }
  ngOnInit(): void {
    this.coreService.setupMessageCommunication();
    this.notificationService.connect();
  }

}
