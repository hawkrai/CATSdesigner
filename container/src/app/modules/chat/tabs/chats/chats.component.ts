import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { chat } from './data';
import { Chat } from './chats.model';
import { DataService } from '../../services/dataService';
import { Subscription } from 'rxjs';
import { ContactService } from '../../services/contactService';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
/**
 * Tab-chat component
 */
export class ChatsComponent implements OnInit,OnDestroy {

  filterValue:string;
  chats: Chat[];
  subscription: Subscription;
  constructor(private cdr: ChangeDetectorRef,public dataService:DataService,private contactService: ContactService) { }

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
    this.subscription=this.dataService.chats.subscribe(chats=>
      {
        this.chats=chats;
        this.cdr.detectChanges();
      });
    this.dataService.LoadChats();
  }

  filter(): void {
    this.contactService.loadContacts(this.filterValue);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async showChat(chat:Chat) {
    if (!chat.id)
    {
      this.contactService.CreateChat(chat.userId)
      .subscribe(res=>{
        chat.id=res;
        this.dataService.activChat=chat;
        this.dataService.activChatId=chat.id;
        this.dataService.isGroupChat=false;
        this.dataService.LoadChatMsg();
        document.getElementById('chat-room').classList.add('user-chat-show');    
      })      
    }
    else
    {
      this.dataService.activChat=chat;
      this.dataService.activChatId=chat.id;
      this.dataService.isGroupChat=false;
      this.dataService.LoadChatMsg();
      document.getElementById('chat-room').classList.add('user-chat-show');  
    }
  }
}
