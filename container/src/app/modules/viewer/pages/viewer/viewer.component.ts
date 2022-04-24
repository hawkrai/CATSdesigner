import {Component, OnInit, ChangeDetectorRef, HostListener} from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.less']
})
export class ViewerComponent implements OnInit {

  constructor(private coreService: CoreService, private cdRef: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.coreService.removeCurrentSubject();
    });
  }

  @HostListener('window:message', ['$event'])
  onMessage(e) {
    if (e.data.Value != undefined) {
      this.router.navigate([e.data.Value]);
    }
  }

}
