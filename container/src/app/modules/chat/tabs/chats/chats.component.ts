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
  dataSubscription: Subscription
  contactSubscription: Subscription
  openChatSubscription: Subscription
  loadingStatusSubscription: Subscription

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
    this.contactSubscription = this.contactService.contacts.subscribe(
      (contacts: Chat[]) => {
        if (this.isSearching) {
          this.chats = contacts
          this.cdr.detectChanges()
        }
      }
    )

    this.dataSubscription = this.dataService.chats.subscribe((chats) => {
      if (!this.isSearching) {
        this.chats = chats
        this.cdr.detectChanges()
      }
    })

    this.loadingStatusSubscription =
      this.contactService.loadingStatus.subscribe(() => {
        this.cdr.detectChanges()
      })

    this.searchSubscription = this.searchTerms
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((term) => {
        this.performSearch(term)
      })

    if (!this.contactService.isChatOpen) {
      this.dataService.loadChats()
    }

    this.contactService.isChatOpen = false
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.perfectScrollbar?.directiveRef) {
        const element =
          this.perfectScrollbar.directiveRef.elementRef.nativeElement
        element.removeEventListener('scroll', this.handleScroll.bind(this))
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
    const threshold = 300

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
      const existingChat = dataChats.find((c) => c.userId === contact.userId)
      return {
        ...contact,
        id: existingChat?.id,
        unread: existingChat?.unread ?? 0,
        time: existingChat?.time ? new Date(existingChat.time) : undefined,
        lastMessage: existingChat?.lastMessage,
        isOnline: contact.isOnline ?? existingChat?.isOnline ?? false,
      }
    })
    this.cdr.detectChanges()
  }

  filter(): void {
    this.searchTerms.next(this.filterValue || '')
  }

  private performSearch(term: string): void {
    if (!term || term.trim() === '') {
      this.isSearching = false
      this.chats = this.dataService.chats.getValue().map((chat) => ({
        ...chat,
        time: chat.time ? new Date(chat.time) : undefined,
      }))
    } else {
      this.isSearching = true
      this.chats = []
      this.contactService.loadContacts(term)
    }
    this.cdr.detectChanges()
  }

  ngOnDestroy(): void {
    this.openChatSubscription?.unsubscribe()
    this.dataSubscription?.unsubscribe()
    this.contactSubscription?.unsubscribe()
    this.loadingStatusSubscription?.unsubscribe()
    this.searchSubscription?.unsubscribe()

    if (this.perfectScrollbar?.directiveRef) {
      const element =
        this.perfectScrollbar.directiveRef.elementRef.nativeElement
      element.removeEventListener('scroll', this.handleScroll.bind(this))
    }
    if (this.loadMoreTimer) {
      clearTimeout(this.loadMoreTimer)
    }
  }

  showChat(chat: Chat) {
    if (!chat) {
      return
    }
    if (!chat) return

    if (!chat.id) {
      this.contactService.CreateChat(chat.userId).subscribe(
        (chatId) => {
          if (chatId) {
            chat.id = chatId
            this.dataService.setActiveChat(chat.id, false, chat)
            this.dataService.markActiveChatAsRead()
            this.dataService.updateOrAddChat(chat)
            this.signalRService.addChat(
              this.dataService.user.id,
              chat.userId,
              chatId
            )
          }
        },
        (error) => {
          console.error('Error creating chat:', error)
        }
      )
    } else {
      this.dataService.setActiveChat(chat.id, false, chat)
      this.dataService.markActiveChatAsRead()
    }

    this.filterValue = ''
    this.searchTerms.next('')
    this.isSearching = false
  }
}
