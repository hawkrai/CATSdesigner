import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Message } from '@chat/shared/models/entities/message.model'
import { SignalRService } from '@chat/shared/services/signalRSerivce'
import {
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from 'ngx-perfect-scrollbar'
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap'
import { FileService } from '@chat/shared/services/files.service'
import { ContactService } from '@chat/shared/services/contactService'
import { GroupListComponent } from '@chat/tabs/GroupList/groupList.component'
import { ClipboardService } from 'ngx-clipboard'
import { MessageCto } from '@chat/shared/models/dto/messageCto'
import { DataService } from '@chat/shared/services/dataService'
import { VideoChatService } from '@modules/video-chat/services/video-chat.service'
import { ToastrService } from 'ngx-toastr'
import { Subject, Subscription, combineLatest } from 'rxjs'
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ScrollUtils } from '@chat/shared/utils/scrollUtils'
import { ILoadMessagesResult } from '@chat/shared/models/interfaces/loadMessagesResult.interface'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit, OnDestroy, AfterViewInit {
  activetab = 2
  currentMsg: MessageCto = new MessageCto()
  filterValue: string = ''
  isEdit: boolean
  editedMsg: Message | null = null
  unreadChat: number = 0
  unreadGroup: number = 0
  private lastScrollTop: number = 0
  private scrollLock: boolean = false
  private destroy$ = new Subject<void>()
  private intersectionObserver: IntersectionObserver
  private loadTriggerElement: HTMLElement
  private searchTerms = new Subject<string>()
  private searchSubscription: Subscription

  constructor(
    private cdr: ChangeDetectorRef,
    private clipboardApi: ClipboardService,
    private contactService: ContactService,
    public dialog: MatDialog,
    public signalRService: SignalRService,
    public dataService: DataService,
    public fileService: FileService,
    public videoChatService: VideoChatService,
    private toastr: ToastrService,
    private zone: NgZone
  ) {}

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective
  @ViewChild('loadTrigger', { static: false }) loadTriggerRef: ElementRef
  @ViewChild('searchDropdown') searchDropdown: NgbDropdown

  ngOnInit(): void {
    this.contactService.openChatComand
      .pipe(takeUntil(this.destroy$))
      .subscribe((chatToOpen) => {
        if (chatToOpen && chatToOpen.id !== this.dataService.activChatId) {
          this.activateChat(chatToOpen)
          this.activetab = 2
        }
      })

    this.dataService.readMessageChatCount
      .pipe(takeUntil(this.destroy$))
      .subscribe((count) => {
        this.unreadChat = count
        this.cdr.detectChanges()
      })
    this.dataService.readMessageGroupCount
      .pipe(takeUntil(this.destroy$))
      .subscribe((count) => {
        this.unreadGroup = count
        this.cdr.detectChanges()
      })

    this.dataService.loadGroups()
    this.dataService.loadChats()

    combineLatest([
      this.dataService.messages,
      this.dataService.searchResults,
      this.dataService.isSearching,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([messages, searchResults, isSearching]) => {
        this.cdr.detectChanges()
      })

    this.dataService.loadingMessagesStatus
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cdr.detectChanges())

    this.currentMsg.text = ''

    this.searchSubscription = this.searchTerms
      .pipe(takeUntil(this.destroy$), debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.dataService.searchMessages(term)
      })

    this.dataService.initialMessagesLoaded
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.zone.runOutsideAngular(() => {
          requestAnimationFrame(() => {
            this.scrollToBottom(false)
          })
        })
      })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.componentRef?.directiveRef) {
        this.setupIntersectionObserver()
      }
    }, 500)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()

    if (this.searchSubscription) this.searchSubscription.unsubscribe()
    if (this.intersectionObserver) this.intersectionObserver.disconnect()
  }

  private setupIntersectionObserver() {
    if (!this.componentRef?.directiveRef) return
    if (this.intersectionObserver) this.intersectionObserver.disconnect()
    const messagesContainer =
      this.componentRef.directiveRef.elementRef.nativeElement
    if (!this.loadTriggerRef?.nativeElement) return
    this.loadTriggerElement = this.loadTriggerRef.nativeElement

    const options = {
      root: messagesContainer,
      rootMargin: '150px 0px 0px 0px',
      threshold: 0.01,
    }

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !this.dataService.loadingMoreMessages &&
          !this.scrollLock
        ) {
          if (this.dataService.isSearching.getValue()) {
            if (this.dataService.hasMoreSearchResults) {
              this.loadMoreSearchResults()
            }
          } else {
            if (this.dataService.hasMoreMessages) {
              this.loadMoreMessages()
            }
          }
        }
      })
    }, options)

    this.intersectionObserver.observe(this.loadTriggerElement)
  }

  activateChat(chatData: any) {
    if (!chatData || !chatData.id) return
    if (this.dataService.activChatId === chatData.id) return

    let chatId = chatData.id
    let isGroup =
      !!chatData.groups || !!chatData.groupId || !!chatData.shortName

    this.dataService.setActiveChat(chatId, isGroup, chatData)

    let unreadCountToDecrement = 0
    if (isGroup) {
      const [subjIdx, grpIdx] = this.dataService.getNumGroupById(chatId)
      if (grpIdx > -1) {
        const subjects = this.dataService.groups.getValue()
        if (subjects[subjIdx]?.groups[grpIdx]) {
          unreadCountToDecrement = subjects[subjIdx].groups[grpIdx].unread || 0
          if (unreadCountToDecrement > 0) {
            subjects[subjIdx].groups[grpIdx].unread = 0
            this.dataService.groups.next([...subjects])
          }
        }
      } else {
        const subjIdxById = this.dataService.getNumSubjectById(chatId)
        if (subjIdxById > -1) {
          const subjects = this.dataService.groups.getValue()
          if (subjects[subjIdxById]) {
            unreadCountToDecrement = subjects[subjIdxById].unread || 0
            if (unreadCountToDecrement > 0) {
              subjects[subjIdxById].unread = 0
              this.dataService.groups.next([...subjects])
            }
          }
        }
      }
      if (unreadCountToDecrement > 0) {
        this.dataService.readMessageGroupCount.next(
          Math.max(
            0,
            this.dataService.readMessageGroupCount.getValue() -
              unreadCountToDecrement
          )
        )
        this.dataService.groupRead()
      }
    } else {
      const chatIndex = this.dataService.getNumChatById(chatId)
      if (chatIndex > -1) {
        const chats = this.dataService.chats.getValue()
        unreadCountToDecrement = chats[chatIndex].unread || 0
        if (unreadCountToDecrement > 0) {
          chats[chatIndex].unread = 0
          this.dataService.chats.next([...chats])
          this.dataService.readMessageChatCount.next(
            Math.max(
              0,
              this.dataService.readMessageChatCount.getValue() -
                unreadCountToDecrement
            )
          )
          this.dataService.updateRead()
        }
      }
    }

    document.getElementById('chat-room')?.classList.add('user-chat-show')

    if (this.dataService.isSearching.getValue()) {
      this.filterValue = ''
      this.searchTerms.next('')
    }
    this.cdr.detectChanges()
  }

  loadMoreMessages() {
    this.scrollLock = true
    const scrollElement =
      this.componentRef?.directiveRef?.elementRef.nativeElement
    const oldScrollHeight = scrollElement?.scrollHeight ?? 0

    if (this.componentRef?.directiveRef) {
      this.lastScrollTop =
        this.componentRef.directiveRef.elementRef.nativeElement.scrollTop
    }

    this.dataService.loadMoreMessages().subscribe({
      next: (result) => {
        this.handleLoadMoreResult(result, scrollElement, oldScrollHeight)
      },
      error: () => {
        this.scrollLock = false
        this.cdr.detectChanges()
      },
    })
    this.cdr.detectChanges()
  }

  loadMoreSearchResults() {
    this.scrollLock = true
    const scrollElement =
      this.componentRef?.directiveRef?.elementRef.nativeElement
    const oldScrollHeight = scrollElement?.scrollHeight ?? 0

    if (this.componentRef?.directiveRef) {
      this.lastScrollTop =
        this.componentRef.directiveRef.elementRef.nativeElement.scrollTop
    }

    this.dataService.loadMoreSearchResults().subscribe({
      next: (result) => {
        this.handleLoadMoreResult(result, scrollElement, oldScrollHeight)
      },
      error: () => {
        this.scrollLock = false
        this.cdr.detectChanges()
      },
    })
    this.cdr.detectChanges()
  }

  private handleLoadMoreResult(
    result: ILoadMessagesResult,
    scrollElement: HTMLElement | undefined,
    oldScrollHeight: number
  ) {
    if (result.addedCount > 0 && scrollElement) {
      this.zone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = scrollElement.scrollHeight
          scrollElement.scrollTop =
            newScrollHeight - oldScrollHeight + this.lastScrollTop
          this.scrollLock = false
          this.zone.run(() => this.cdr.detectChanges())
        })
      })
    } else {
      this.scrollLock = false
      this.cdr.detectChanges()
    }
  }

  scrollToBottom(smooth = false) {
    if (this.componentRef?.directiveRef) {
      setTimeout(() => {
        ScrollUtils.scrollToBottom(this.componentRef.directiveRef, smooth)
        this.lastScrollTop =
          this.componentRef.directiveRef.elementRef.nativeElement.scrollHeight
      }, 50)
    }
  }

  openFilter() {
    if (this.filterValue) {
      this.filterValue = ''
      this.filter()
    }
    this.searchDropdown?.close()
  }

  filter(): void {
    this.searchTerms.next(this.filterValue || '')
  }

  copyText(text: string) {
    this.clipboardApi.copyFromContent(text)
    this.toastr.info('Текст скопирован')
  }

  edit(msg: Message) {
    this.isEdit = true
    this.editedMsg = msg
    this.currentMsg.text = msg.text
  }

  stopEdit() {
    this.isEdit = false
    this.currentMsg = new MessageCto()
    this.currentMsg.text = ''
    this.editedMsg = null
  }

  openStudentsList() {
    if (this.dataService.isGroupChat && this.dataService.activChat.groupId) {
      const dialogRef = this.dialog.open(GroupListComponent, {
        width: '700px',
        data: this.dataService.activChat.groupId,
      })
    }
  }

  attachFileClick(fileInput: any) {
    if (!this.dataService.activChat) {
      this.toastr.warning('Не выбран чат!')
      return false
    }
    fileInput.value = null
    fileInput.click()
  }

  uploadFiles(event) {
    if (!this.dataService.activChat) {
      this.toastr.warning('Не выбран чат!')
      return false
    }
    if (event.files) this.fileService.UploadFile(event.files)
  }

  download(filename: string) {
    this.fileService.DownloadFile(filename)
  }

  remove(id: any) {
    if (id === undefined || id === null) return
    this.signalRService.remove(id)
  }

  sendMsg() {
    if (!this.dataService.activChat) {
      this.toastr.warning('Не выбран чат!')
      return false
    }

    if (
      !this.currentMsg?.text ||
      this.currentMsg.text === '' ||
      this.currentMsg.text.length > 25000
    ) {
      this.toastr.warning('Сообщение пустое или превышает разрешенный размер!')
      return
    }

    if (this.isEdit) {
      const updatePromise = this.dataService.isGroupChat
        ? this.signalRService.updateGroupMessage(
            this.editedMsg.id,
            this.currentMsg.text,
            this.dataService.activChatId
          )
        : this.signalRService.updateChatMessage(
            this.editedMsg.id,
            this.currentMsg.text,
            this.dataService.activChatId
          )

      updatePromise.then(
        () => {
          this.currentMsg.text = ''
          this.stopEdit()
          this.cdr.detectChanges()
          this.toastr.info('Сообщение изменено')
        },
        () => {
          this.toastr.error('Ошибка отправки')
          this.signalRService.connect()
        }
      )
    } else {
      this.currentMsg.userId = this.dataService.user.id
      this.currentMsg.chatId = this.dataService.activChatId

      const sendPromise = this.dataService.isGroupChat
        ? this.signalRService.sendGroupMessage(this.currentMsg)
        : this.signalRService.sendMessage(this.currentMsg)

      sendPromise.then(
        () => {
          this.currentMsg.text = ''
          this.cdr.detectChanges()
          setTimeout(() => this.scrollToBottom(true), 300)
        },
        () => {
          this.toastr.error('Ошибка отправки')
          this.signalRService.connect()
        }
      )

      if (this.dataService.isGroupChat) {
        this.dataService.groupRead()
      } else {
        this.dataService.updateRead()
      }
    }
  }

  closeUserChat() {
    document.getElementById('chat-room').classList.remove('user-chat-show')
  }

  startCall() {
    if (!this.dataService.activChat) {
      this.toastr.warning('Не выбран чат!')
      return false
    }
    this.signalRService.sendCallRequest(this.dataService.activChatId)
  }

  isAllowedForUser() {
    if (!this.videoChatService.isSecureConnection()) {
      this.toastr.error('Видео-чат не доступен в небезопасном режиме')
      return false
    }

    return (
      !this.dataService?.activChat?.groupId &&
      this.dataService.user.role === 'lector'
    )
  }

  get displayedMessages(): Message[] {
    return this.dataService.isSearching.getValue()
      ? this.dataService.searchResults.getValue()
      : this.dataService.messages.getValue()
  }

  get hasMoreMessagesToLoad(): boolean {
    return this.dataService.isSearching.getValue()
      ? this.dataService.hasMoreSearchResults
      : this.dataService.hasMoreMessages
  }
}
