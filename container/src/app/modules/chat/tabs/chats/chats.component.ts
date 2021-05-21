import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { chat } from './data';
import { Chats } from './chats.model';
import { DataService } from '../../services/dataService';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
/**
 * Tab-chat component
 */
export class ChatsComponent implements OnInit {

  chat: Chats[];

  constructor(public dataService:DataService) { }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    dots: false,
    margin: 16,
    navSpeed: 700,
    items: 4,
    nav: false
  };

  ngOnInit(): void {
    if (!this.dataService.isLoaded)
      this.dataService.load();
    this.chat = this.dataService.chats;
  }

  /**
   * Show user chat
   */
  // tslint:disable-next-line: typedef
  async showChat(id:number) {
    this.dataService.LoadMsg(id);
    console.log(id);
    document.getElementById('chat-room').classList.add('user-chat-show');
  }
}
