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
  HostListener,
} from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Router, NavigationStart } from '@angular/router'
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
import { Chat } from '@chat/shared/models/entities/chats.model'
import { VideoChatService } from '@modules/video-chat/services/video-chat.service'
import { ToastrService } from 'ngx-toastr'
import { Subject, Subscription, combineLatest } from 'rxjs'
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  filter,
  take,
} from 'rxjs/operators'
import { ScrollUtils } from '@chat/shared/utils/scrollUtils'
import { ILoadMessagesResult } from '@chat/shared/models/interfaces/loadMessagesResult.interface'
import { IStudentListData } from '@chat/shared/models/interfaces/studentListData.interface'
import { TranslatePipe } from 'educats-translate'
import { MarkdownService } from '@app/shared/utils/markdown.service'
import {
  TextFormatService,
  FormatTag,
} from '@app/shared/utils/text-format.service'
import * as TurndownModule from 'turndown'

const TurndownServiceClass = (TurndownModule as any).default || TurndownModule

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
  isFormatPanelOpen: boolean = false
  activeFormats = new Set<FormatTag>()
  isSearchExpanded = false
  isMobileView: boolean
  private lastScrollTop: number = 0
  private scrollLock: boolean = false
  private destroy$ = new Subject<void>()
  private searchTerms = new Subject<string>()
  private searchSubscription: Subscription
  private preloadOffset = 120
  private turndownService = new TurndownServiceClass()
  private studentListDialogRef: MatDialogRef<GroupListComponent> | null = null
  private routerSubscription: Subscription
  private restoreDone = false

  readonly MIN_INPUT_HEIGHT = 48
  readonly MAX_INPUT_HEIGHT = 100

  constructor(
    private cdr: ChangeDetectorRef,
    private clipboardApi: ClipboardService,
    private contactService: ContactService,
    public dialog: MatDialog,
    private router: Router,
    public signalRService: SignalRService,
    public dataService: DataService,
    public fileService: FileService,
    public videoChatService: VideoChatService,
    private toastr: ToastrService,
    private zone: NgZone,
    private translatePipe: TranslatePipe,
    private markdownService: MarkdownService,
    private formatter: TextFormatService
  ) {}

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective
  @ViewChild('searchDropdown') searchDropdown: NgbDropdown
  @ViewChild('messageTextarea') messageTextarea: ElementRef
  @ViewChild('searchInput') searchInput: ElementRef
  @HostListener('window:resize', ['$event'])
  ngOnInit(): void {
    this.contactService.openChatComand
      .pipe(
        takeUntil(this.destroy$),
        filter((chatToOpen) => !!chatToOpen)
      )
      .subscribe((chatToOpen) => {
        this.activetab = 2

        if (!chatToOpen.id) {
          this.contactService.CreateChat(chatToOpen.userId).subscribe(
            (chatId) => {
              if (chatId) {
                chatToOpen.id = chatId
                this.dataService.setActiveChat(chatToOpen.id, false, chatToOpen)
                this.dataService.updateOrAddChat(chatToOpen)
                this.signalRService.addChat(
                  this.dataService.user.id,
                  chatToOpen.userId,
                  chatId
                )
              }
            },
            (error) => console.error('Error creating chat:', error)
          )
        } else {
          this.dataService.setActiveChat(chatToOpen.id, false, chatToOpen)
        }

        if (this.dataService.isSearching.getValue()) {
          this.filterValue = ''
          this.searchTerms.next('')
        }

        this.contactService.openChatComand.next(null)
        this.cdr.detectChanges()
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
        this.dataService.markActiveChatAsRead()
        this.zone.runOutsideAngular(() => {
          requestAnimationFrame(() => {
            this.scrollToBottom(false)
          })
        })
      })

    this.turndownService.addRule('underline', {
      filter: ['u'],
      replacement: (content: string) => `<u>${content}</u>`,
    })
    this.turndownService.addRule('preCode', {
      filter: (node) =>
        node.nodeName === 'PRE' && node.firstChild?.nodeName === 'CODE',
      replacement: (content, node: HTMLElement) => {
        return `\n\`\`\`\n${node.textContent}\`\`\`\n`
      },
    })

    this.routerSubscription = this.router.events
      .pipe(filter((evt) => evt instanceof NavigationStart))
      .subscribe(() => {
        if (this.studentListDialogRef) {
          this.studentListDialogRef.close()
          this.studentListDialogRef = null
        }
      })

    this.dataService.activeChatUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.detectChanges()
      })

    this.tryRestoreChat()
    this.checkScreenWidth()
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()

    if (this.searchSubscription) this.searchSubscription.unsubscribe()
    if (this.routerSubscription) this.routerSubscription.unsubscribe()
  }

  onScroll(): void {
    if (this.scrollLock || this.dataService.loadingMoreMessages) {
      return
    }

    const el = this.directiveRef?.elementRef.nativeElement
    if (!el) {
      return
    }

    if (el.scrollTop <= this.preloadOffset) {
      this.tryLoadMoreMessages()
    }
  }

  onReachStart(): void {
    if (this.scrollLock || this.dataService.loadingMoreMessages) {
      return
    }
    this.tryLoadMoreMessages()
  }

  autoResize(textarea: HTMLTextAreaElement): void {
    if (!textarea) {
      return
    }

    if (!textarea.value.trim()) {
      textarea.style.height = this.MIN_INPUT_HEIGHT + 'px'
      return
    }

    const newHeight = Math.min(textarea.scrollHeight, this.MAX_INPUT_HEIGHT)
    textarea.style.height = newHeight + 'px'

    if (
      newHeight > this.MIN_INPUT_HEIGHT &&
      newHeight < this.MAX_INPUT_HEIGHT &&
      this.isScrollAtBottom()
    ) {
      setTimeout(() => {
        this.scrollToBottom(false)
      }, 100)
    }
  }

  onResize(event?) {
    this.checkScreenWidth()
  }

  private checkScreenWidth(): void {
    this.isMobileView = window.innerWidth < 992
  }

  private tryRestoreChat(): void {
    const savedRaw = localStorage.getItem('activeChat')
    const saved = savedRaw ? JSON.parse(savedRaw) : null
    if (!saved || this.restoreDone) {
      return
    }

    if (saved.isGroup) {
      this.dataService.groups
        .pipe(
          filter((g) => g.length > 0),
          take(1)
        )
        .subscribe((groups) => {
          const subject = groups.find((s) => s.id === saved.id)
          const nested: Chat[] = [].concat(...groups.map((s) => s.groups || []))

          const groupChat = nested.find((g) => g.id === saved.id)
          const chatInfo = subject || groupChat

          if (chatInfo) {
            this.activetab = 3
            this.dataService.setActiveChat(saved.id, true, chatInfo)
            this.cdr.detectChanges()
            this.restoreDone = true
          }
        })
    } else {
      this.dataService.chats
        .pipe(
          filter((c) => c.length > 0),
          take(1)
        )
        .subscribe((chats) => {
          const chat = chats.find((c) => c.id === saved.id)
          if (chat) {
            this.activetab = 2
            this.dataService.setActiveChat(saved.id, false, chat)
            this.cdr.detectChanges()
            this.restoreDone = true
          }
        })
    }
  }

  private tryLoadMoreMessages(): void {
    this.scrollLock = true

    const canLoad = this.dataService.isSearching.getValue()
      ? this.dataService.hasMoreSearchResults
      : this.dataService.hasMoreMessages

    if (!canLoad) {
      this.scrollLock = false
      return
    }

    if (this.dataService.isSearching.getValue()) {
      this.loadMoreSearchResults()
    } else {
      this.loadMoreMessages()
    }
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
      }, 0)
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

  copyText(html: string) {
    const md = this.turndownService.turndown(html)
    this.clipboardApi.copyFromContent(md)
    this.toastr.success(
      this.translatePipe.transform('chat.textCopied', 'Текст скопирован')
    )
  }

  edit(msg: Message) {
    this.isEdit = true
    this.editedMsg = msg

    const md = this.turndownService.turndown(msg.text || '')
    this.currentMsg.text = md
    setTimeout(() => {
      this.autoResize(this.messageTextarea.nativeElement)
    }, 0)
  }

  stopEdit() {
    this.isEdit = false
    this.currentMsg = new MessageCto()
    this.currentMsg.text = ''
    this.editedMsg = null
    this.resetTextareaHeight()
  }

  openStudentsList() {
    if (
      this.dataService.isGroupChat &&
      this.dataService.activChat &&
      this.dataService.activChat.groupId
    ) {
      const dialogData: IStudentListData = {
        groupId: this.dataService.activChat.groupId,
        groupName: this.dataService.activChat.name,
      }

      this.studentListDialogRef = this.dialog.open(GroupListComponent, {
        width: '548px',
        height: 'calc(100vh - 64px)',
        maxHeight: 'calc(100vh - 64px)',
        position: { top: '64px' },
        backdropClass: 'headerless-backdrop',
        data: dialogData,
        autoFocus: false,
        disableClose: true,
      })

      this.studentListDialogRef
        .afterClosed()
        .pipe(filter((selectedChat): selectedChat is Chat => !!selectedChat))
        .subscribe((selectedChat) => {
          this.contactService.openChat(selectedChat)
          this.cdr.markForCheck()
        })
    }
  }

  attachFileClick(fileInput: any) {
    if (this.dataService.activChat?.isCompletedForUser) {
      this.toastr.warning(
        this.translatePipe.transform(
          'chat.cannotAttachToCompletedChat',
          'Нельзя прикреплять файлы к завершенному чату.'
        )
      )
      return false
    }

    fileInput.value = null
    fileInput.click()
  }

  uploadFiles(event) {
    if (!this.dataService.activChat) {
      this.toastr.warning(
        this.translatePipe.transform('chat.noChatWarning', 'Не выбран чат!')
      )
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
    this.toastr.success(
      this.translatePipe.transform(
        'chat.messageDeletedSuccess',
        'Сообщение успешно удалено у всех адресатов'
      )
    )
  }

  sendMsg() {
    if (this.dataService.activChat?.isCompletedForUser) {
      this.toastr.warning(
        this.translatePipe.transform(
          'chat.cannotSendToCompletedChat',
          'Нельзя отправлять сообщения в завершенный чат.'
        )
      )
      return false
    }

    if (
      !this.currentMsg?.text ||
      this.currentMsg.text.trim().length === 0 ||
      this.currentMsg.text.length > 25000
    ) {
      this.toastr.warning(
        this.translatePipe.transform(
          'chat.messageSizeWarning',
          'Сообщение пустое или превышает разрешенный размер!'
        )
      )
      return
    }

    const htmlText = this.markdownService.toHtml(this.currentMsg.text)

    if (this.isEdit) {
      const updatePromise = this.dataService.isGroupChat
        ? this.signalRService.updateGroupMessage(
            this.editedMsg.id,
            htmlText,
            this.dataService.activChatId
          )
        : this.signalRService.updateChatMessage(
            this.editedMsg.id,
            htmlText,
            this.dataService.activChatId
          )

      updatePromise.then(
        () => {
          this.stopEdit()
          if (!this.isFormatPanelOpen) {
            this.resetTextareaHeight()
          }
          this.cdr.detectChanges()
          this.toastr.success(
            this.translatePipe.transform(
              'chat.messageEdited',
              'Сообщение изменено'
            )
          )
        },
        () => {
          this.toastr.error(
            this.translatePipe.transform(
              'chat.messageSentError',
              'Ошибка отправки сообщения'
            )
          )
          this.signalRService.connect()
        }
      )
    } else {
      const payload: MessageCto = {
        ...this.currentMsg,
        text: htmlText,
        userId: this.dataService.user.id,
        chatId: this.dataService.activChatId,
      }

      const sendPromise = this.dataService.isGroupChat
        ? this.signalRService.sendGroupMessage(payload)
        : this.signalRService.sendMessage(payload)

      sendPromise.then(
        () => {
          this.currentMsg.text = ''
          this.updateActiveFormats()
          if (!this.isFormatPanelOpen) {
            this.resetTextareaHeight()
          }
          this.cdr.detectChanges()
          setTimeout(() => this.scrollToBottom(true), 300)
        },
        () => {
          this.toastr.error(
            this.translatePipe.transform(
              'chat.messageSentError',
              'Ошибка отправки сообщения'
            )
          )
          this.signalRService.connect()
        }
      )

      if (this.dataService.isGroupChat) {
        this.dataService.groupRead().subscribe()
      } else {
        this.dataService.updateRead().subscribe()
      }
    }
  }

  closeUserChat() {
    this.dataService.setActiveChat(null, false, null)
    if (this.isFormatPanelOpen) {
      this.isFormatPanelOpen = false
      this.cdr.detectChanges()
    }
  }

  startCall() {
    if (!this.videoChatService.isSecureConnection()) {
      this.toastr.error(
        this.translatePipe.transform(
          'videochat.unsafeError',
          'Видеочат не доступен в небезопасном режиме!'
        )
      )
      return false
    }

    if (!this.dataService.activChat) {
      this.toastr.warning(
        this.translatePipe.transform('chat.noChatWarning', 'Не выбран чат!')
      )
      return false
    }
    this.signalRService.sendCallRequest(this.dataService.activChatId)
  }

  isAllowedForUser() {
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

  get groupColor(): string {
    if (!this.dataService.isGroupChat || !this.dataService.activChat) {
      return ''
    }

    if ((this.dataService.activChat as any).color) {
      return (this.dataService.activChat as any).color
    }

    const parent = this.dataService.groups
      .getValue()
      .find(
        (s) => s.groups?.some((g) => g.id === this.dataService.activChat.id)
      )

    return parent?.color || '#6c757d'
  }

  get parentSubjectName(): string | null {
    if (
      this.dataService.isGroupChat &&
      this.dataService.activeSubjectForGroup
    ) {
      return this.dataService.activeSubjectForGroup.name
    }
    return null
  }

  get parentSubjectShortName(): string | null {
    if (
      this.dataService.isGroupChat &&
      this.dataService.activeSubjectForGroup
    ) {
      return this.dataService.activeSubjectForGroup.shortName
    }
    return null
  }

  getInitials(name: string): string {
    if (!name) return ''

    const nameParts = name.split(' ')
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0)
    }

    return nameParts[0].charAt(0) + nameParts[1].charAt(0)
  }

  toggleFormatPanel(): void {
    if (
      this.dataService.activChat?.isCompletedForUser &&
      !this.isFormatPanelOpen
    ) {
      return
    }

    this.isFormatPanelOpen = !this.isFormatPanelOpen
    this.cdr.detectChanges()
    const scrollWasAtBottom = this.isScrollAtBottom()
    setTimeout(() => {
      this.messageTextarea?.nativeElement.focus()

      if (!this.isFormatPanelOpen) {
        this.autoResize(this.messageTextarea.nativeElement)
      }

      if (this.isFormatPanelOpen && scrollWasAtBottom) {
        this.scrollToBottom(false)
      }
    }, 100)
  }

  private resetTextareaHeight(): void {
    const textarea = this.messageTextarea.nativeElement as HTMLTextAreaElement
    textarea.style.height = this.MIN_INPUT_HEIGHT + 'px'
  }

  private isScrollAtBottom(): boolean {
    if (!this.componentRef?.directiveRef) return false

    const element = this.componentRef.directiveRef.elementRef.nativeElement
    return element.scrollHeight - element.scrollTop - element.clientHeight < 100
  }

  applyFormat(tag: FormatTag) {
    if (this.dataService.activChat?.isCompletedForUser) return
    const textarea: HTMLTextAreaElement = this.messageTextarea.nativeElement
    const result = this.formatter.format(
      tag,
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd
    )

    textarea.value = result.value
    textarea.setSelectionRange(result.start, result.end)
    this.currentMsg.text = result.value

    textarea.focus()
    this.autoResize(textarea)
  }

  get hasText(): boolean {
    return !!this.currentMsg?.text && this.currentMsg.text.trim().length > 0
  }

  updateActiveFormats() {
    const ta = this.messageTextarea.nativeElement as HTMLTextAreaElement
    this.activeFormats = this.formatter.detect(
      ta.value,
      ta.selectionStart,
      ta.selectionEnd
    )
  }

  isActive(tag: FormatTag) {
    return this.activeFormats.has(tag)
  }

  @HostListener('document:keydown', ['$event'])
  handleHotkeys(e: KeyboardEvent) {
    const isMac = navigator.platform.toLowerCase().includes('mac')
    const ctrl = isMac ? e.metaKey : e.ctrlKey

    if (e.key === 'Tab' && !ctrl) {
      e.preventDefault()
      this.changeIndent(e.shiftKey ? -1 : 1)
      this.autoResize(this.messageTextarea.nativeElement)
      return
    }

    if (!ctrl) return

    const key = e.key.toLowerCase()
    const shift = e.shiftKey

    const map: Record<string, FormatTag> = {
      b: 'bold',
      i: 'italic',
      u: 'underline',
      '`': 'code',
      '/': 'quote',
    }

    if (key in map) {
      e.preventDefault()
      this.applyFormat(map[key])
    }

    if (key === 'l' && !shift) {
      e.preventDefault()
      this.applyFormat('ul')
    }
    if (key === 'l' && shift) {
      e.preventDefault()
      this.applyFormat('ol')
    }
  }

  onSelectionChange() {
    this.updateActiveFormats()
  }

  private changeIndent(delta: number) {
    const ta: HTMLTextAreaElement = this.messageTextarea.nativeElement
    const { selectionStart: s, selectionEnd: e, value } = ta

    const lines = value.slice(s, e).split('\n')
    const indented = lines.map((l) => {
      if (delta > 0) return '  '.repeat(delta) + l
      return l.replace(/^ {1,2}/, '')
    })

    const newVal = value.slice(0, s) + indented.join('\n') + value.slice(e)

    ta.value = newVal
    const shift = indented.join('\n').length - (e - s)
    ta.setSelectionRange(s, e + shift)
    this.currentMsg.text = newVal
  }

  toggleSearch(): void {
    this.isSearchExpanded = !this.isSearchExpanded

    if (this.isSearchExpanded) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus()
      }, 300)
    } else {
      this.clearSearch()
    }
  }

  closeSearch(): void {
    this.isSearchExpanded = false
    this.clearSearch()
  }

  clearSearch(): void {
    this.filterValue = ''
    this.filter()
    if (this.isSearchExpanded) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus()
      }, 0)
    }
  }
}
