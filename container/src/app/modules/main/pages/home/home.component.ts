import { Component, OnInit } from '@angular/core';
import {ModuleCommunicationService} from 'test-mipe-bntu-schedule';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private modulecommunicationservice: ModuleCommunicationService, private router: Router) { }

  ngOnInit(): void {
    this.modulecommunicationservice.receiveMessage1(window, this.router);
  }

}
