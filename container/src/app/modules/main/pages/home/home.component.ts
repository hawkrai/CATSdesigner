import {Component, HostListener, OnInit} from '@angular/core';
import {ModuleCommunicationService} from 'test-mipe-bntu-schedule';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})


export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  @HostListener('window:message', ['$event'])
  onMessage(e) {
    if (e.data.Value != undefined) {
      this.router.navigate([e.data.Value]);
    }
  }


}
