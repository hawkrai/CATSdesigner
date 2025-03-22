import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core'
import { OwlOptions } from 'ngx-owl-carousel-o'
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar'
import { Subject, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { Chat } from '@chat/shared/models/entities/chats.model'
import { DataService } from '@chat/shared/services/dataService'
import { ContactService } from '@chat/shared/services/contactService'
import { SignalRService } from '@chat/shared/services/signalRSerivce'

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
/**
 * Tab-chat component
 */
export class ChatsComponent implements OnInit, OnDestroy, AfterViewInit {
  filterValue: string = ''
  chats: Chat[]
  isSearching: boolean = false
  subscription: Subscription
  subscriptionContact: Subscription
  private loadMoreTimer: any = null
  private searchTerms = new Subject<string>()
  private searchSubscription: Subscription
  @ViewChild(PerfectScrollbarComponent)
  perfectScrollbar: PerfectScrollbarComponent

  constructor(
    private cdr: ChangeDetectorRef,
    private signalRService: SignalRService,
    public dataService: DataService,
    public contactService: ContactService
  ) {}

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    dots: false,
    margin: 16,
    navSpeed: 700,
    items: 4,
    nav: false,
  }

  ngOnInit(): void {
    this.dataService.messages.next([])
    this.dataService.activChat = null
    this.dataService.activChatId = 0
    this.dataService.activGroup = null
    this.dataService.isGroupChat = false

    this.subscriptionContact = this.contactService.openChatComand.subscribe(
      (x) => this.showChat(x)
    )

    this.subscription = this.dataService.chats.subscribe((chats) => {
      if (chats) {
        if (!this.isSearching) {
          this.chats = chats
        }
        this.cdr.detectChanges()
      }
    })

    this.contactService.contacts.subscribe((contacts) => {
      if (contacts && contacts.length > 0 && this.isSearching) {
        this.updateSearchResults(contacts)
        this.cdr.detectChanges()
      }
    })

    this.contactService.loadingStatus.subscribe((isLoading) => {
      this.cdr.detectChanges()
    })

    this.searchSubscription = this.searchTerms
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((term) => {
        this.performSearch(term)
      })

    if (!this.contactService.isChatOpen) {
      this.dataService.loadChats()
    } else {
      this.contactService.isChatOpen = false
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.perfectScrollbar && this.perfectScrollbar.directiveRef) {
        const element =
          this.perfectScrollbar.directiveRef.elementRef.nativeElement
        element.addEventListener('scroll', this.handleScroll.bind(this))
      }
    }, 500)
  }

  handleScroll(event) {
    if (!this.isSearching || this.contactService.loadingMore) {
      return
    }
    const element = event.target
    const scrollPosition = element.scrollTop
    const scrollHeight = element.scrollHeight
    const clientHeight = element.clientHeight
    const threshold = 100

    if (scrollHeight - scrollPosition - clientHeight < threshold) {
      this.loadMoreContactsWithDebounce()
    }
  }

  loadMoreContactsWithDebounce() {
    if (this.contactService.loadingMore) return

    if (this.loadMoreTimer) {
      clearTimeout(this.loadMoreTimer)
    }

    this.loadMoreTimer = setTimeout(() => {
      this.contactService.loadMoreContacts()
    }, 300)
  }

  updateSearchResults(contacts: Chat[]) {
    if (!contacts || contacts.length === 0) return

    const dataChats = this.dataService.chats.getValue()
    this.chats = contacts.map((contact) => {
      const existingChat = dataChats.find(
        (c) => c.userId === contact.userId || c.name === contact.name
      )
      if (existingChat) {
        return {
          ...contact,
          id: existingChat.id,
          unread: existingChat.unread,
          time: existingChat.time,
          lastMessage: existingChat.lastMessage,
          isOnline: contact.isOnline || existingChat.isOnline,
        }
      }
      return contact
    })
  }

  filter(): void {
    this.searchTerms.next(this.filterValue)
  }

  private performSearch(term: string): void {
    if (!term || term.trim() === '') {
      this.isSearching = false
      this.chats = this.dataService.chats.getValue()
    } else {
      this.isSearching = true
      this.chats = []
      this.contactService.loadContacts(term)
    }
    this.cdr.detectChanges()
  }

  ngOnDestroy(): void {
    if (this.subscriptionContact) {
      this.subscriptionContact.unsubscribe()
    }

    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe()
    }

    if (this.perfectScrollbar && this.perfectScrollbar.directiveRef) {
      const element =
        this.perfectScrollbar.directiveRef.elementRef.nativeElement
      element.removeEventListener('scroll', this.handleScroll.bind(this))
    }

    if (this.loadMoreTimer) {
      clearTimeout(this.loadMoreTimer)
    }
  }

  showChat(chat: Chat) {
    if (chat != null) {
      if (!chat.id) {
        this.contactService.CreateChat(chat.userId).subscribe((res) => {
          chat.id = res
          this.dataService.activChat = chat
          this.dataService.activChatId = chat.id
          this.dataService.isGroupChat = false
          this.dataService.chats.next(
            this.dataService.chats.getValue().concat(chat)
          )
          this.filterValue = ''
          this.isSearching = false
          this.dataService.LoadChatMsg()
          this.signalRService.addChat(
            Number.parseInt(this.dataService.user.id),
            chat.userId,
            res
          )
          document.getElementById('chat-room').classList.add('user-chat-show')
        })
      } else {
        this.dataService.readMessageChatCount.next(
          this.dataService.readMessageChatCount.getValue() - chat.unread
        )
        this.dataService.readMessageCount.next(chat.unread)
        chat.unread = 0
        this.dataService.activChat = chat
        this.dataService.activChatId = chat.id
        this.dataService.isGroupChat = false
        this.dataService.updateRead()
        this.dataService.LoadChatMsg()
        document.getElementById('chat-room').classList.add('user-chat-show')
      }

      this.filterValue = ''
      this.searchTerms.next('')
      this.isSearching = false
    }
  }
}
