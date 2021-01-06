import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.less']
})
export class ContentLayoutComponent implements OnInit {
  
  constructor(
    private coreService: CoreService
  ) {

  }
  ngOnInit(): void {
    this.coreService.setupMessageCommunication();
  }

}
