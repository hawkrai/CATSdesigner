import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { Chat } from './chats.model';
import { DataService } from '../../services/dataService';
import { Subscription } from 'rxjs';
import { ContactService } from '../../services/contactService';
import { SignalRService } from '../../services/signalRSerivce';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
/**
 * Tab-chat component
 */
export class ChatsComponent implements OnInit, OnDestroy {

  filterValue: string;
  chats: Chat[];
  subscription: Subscription;
  constructor(private cdr: ChangeDetectorRef,private signalRService: SignalRService, public dataService: DataService, private contactService: ContactService) { }

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
    this.subscription = this.dataService.chats.subscribe(chats => {
      if (chats) {
        this.chats = chats;
        var contacts = this.contactService.contacts.getValue();
        contacts.forEach(x => {
          var chat = chats.find(y => y.name == x.name)
          if (chat) {
            x.id = chat.id;
            x.isOnline = chat.isOnline;
          }
        })
        this.contactService.contacts.next(contacts);
        this.cdr.detectChanges();
      }
    });
    this.dataService.LoadChats();
  }

  filter(): void {
    if (!this.filterValue)
      this.chats = this.dataService.chats.getValue();
    else
      this.chats = this.contactService.contacts.getValue().filter(x => x.name.includes(this.filterValue));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async showChat(chat: Chat) {
    if (!chat.id) {
      this.contactService.CreateChat(chat.userId)
        .subscribe(res => {
          chat.id = res;
          this.dataService.activChat = chat;
          this.dataService.activChatId = chat.id;
          this.dataService.isGroupChat = false;
          this.dataService.chats.next(this.dataService.chats.getValue().concat(chat))
          this.filterValue = "";
          this.dataService.LoadChatMsg();
          this.signalRService.addChat(Number.parseInt(this.dataService.user.id),chat.userId,res);
          document.getElementById('chat-room').classList.add('user-chat-show');
        })
    }
    else {
      this.dataService.readMessageCount.next(chat.unread);
      chat.unread = 0;
      this.dataService.activChat = chat;
      this.dataService.activChatId = chat.id;
      this.dataService.isGroupChat = false;
      this.dataService.updateRead();
      this.dataService.LoadChatMsg();
      document.getElementById('chat-room').classList.add('user-chat-show');
    }
  }
}
