import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.less']
})
export class ViewerComponent implements OnInit {

  constructor(private coreService: CoreService, private cdRef:ChangeDetectorRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.coreService.removeCurrentSubject();    
    });
  }

}
