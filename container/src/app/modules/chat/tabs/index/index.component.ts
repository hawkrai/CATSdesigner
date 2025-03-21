import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Message } from '@chat/shared/models/entities/message.model'
import { Chat } from '@chat/shared/models/entities/chats.model'
import { SignalRService } from '@chat/shared/services/signalRSerivce'
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar'
import { FileService } from '@chat/shared/services/files.service'
import { ContactService } from '@chat/shared/services/contactService'
import { GroupListComponent } from '@chat/tabs/GroupList/groupList.component'
import { ClipboardService } from 'ngx-clipboard'
import { MessageCto } from '@chat/shared/models/dto/messageCto'
import { DataService } from '@chat/shared/services/dataService'
import { VideoChatService } from '@modules/video-chat/services/video-chat.service'
import { ToastrService } from 'ngx-toastr'
import { Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ScrollUtils } from '@chat/shared/utils/scrollUtils'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit, OnDestroy, AfterViewInit  {
  activetab = 2
  currentMsg: MessageCto = new MessageCto()
  chat: Chat
  filterValue: string
  isfilter: boolean
  messages: Message[] = []
  messagesAll: Message[] = []
  isEdit: boolean
  editedMsg: Message
  unreadChat: number = 0
  unreadGroup: number = 0
  newMessagesCount: number = 0
  private lastScrollTop: number = 0
  private scrollLock: boolean = false
  private destroy$ = new Subject<void>()
  private scrollSubscription: Subscription
  private intersectionObserver: IntersectionObserver
  private loadTriggerElement: HTMLElement

  constructor(
    private cdr: ChangeDetectorRef,
    private clipboardApi: ClipboardService,
    private contactService: ContactService,
    public dialog: MatDialog,
    public signalRService: SignalRService,
    public dataService: DataService,
    public fileService: FileService,
    public videoChatService: VideoChatService,
    private toastr: ToastrService
  ) {}

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective
  @ViewChild('loadTrigger', { static: false }) loadTriggerRef: ElementRef

  ngOnInit(): void {
    this.contactService.openChatComand.subscribe(() => {
      this.activetab = 2
      this.cdr.detectChanges()
    })
    this.dataService.readMessageChatCount.subscribe(x => {
      this.unreadChat = x
      this.cdr.detectChanges()
    })
    this.dataService.readMessageGroupCount.subscribe(x => {
      this.unreadGroup = x
      this.cdr.detectChanges()
    })
    this.dataService.LoadGroup()
    this.dataService.LoadChats()
    
    this.dataService.loadingMessagesStatus
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cdr.detectChanges())

      this.dataService.messages
      .pipe(takeUntil(this.destroy$))
      .subscribe((msgs: Message[]) => {
        const wasEmpty = !this.messages || this.messages.length === 0
        this.messages = msgs
        this.messagesAll = msgs
        this.cdr.detectChanges()
        
        if (msgs.length > 0 && (wasEmpty || !this.dataService.loadingMoreMessages)) {
          this.scrollToBottom(false)
        }
      })

    this.currentMsg.text = ''
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.componentRef?.directiveRef) {
        this.setupScrollHandler()
        this.setupIntersectionObserver()
      }
    }, 500)
  }

  ngOnDestroy(): void {    
    this.destroy$.next()
    this.destroy$.complete()
    
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe()
    }
    
    if (this.dataService.loadMessagesTimer) {
      clearTimeout(this.dataService.loadMessagesTimer)
    }

    if (this.componentRef?.directiveRef) {
      const element = this.componentRef.directiveRef.elementRef.nativeElement
      element.removeEventListener('scroll', this.handleScroll)
    }
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
  }

  private setupScrollHandler() {
    const element = this.componentRef.directiveRef.elementRef.nativeElement
    this.handleScroll = this.handleScroll.bind(this)
    element.addEventListener('scroll', this.handleScroll)
  }

  private setupIntersectionObserver() {
    if (!this.componentRef?.directiveRef) return
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
    
    const messagesContainer = this.componentRef.directiveRef.elementRef.nativeElement
    
    if (this.loadTriggerRef?.nativeElement) {
      this.loadTriggerElement = this.loadTriggerRef.nativeElement
    } else {
      this.loadTriggerElement = document.createElement('div')
      this.loadTriggerElement.className = 'load-trigger'
      const messagesList = messagesContainer.querySelector('ul')
      if (messagesList) {
        messagesList.prepend(this.loadTriggerElement)
      }
    }
    
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && 
              !this.dataService.loadingMoreMessages && 
              this.dataService.hasMoreMessages && 
              !this.scrollLock) {
            this.loadMoreMessages()
          }
        })
      },
      { 
        root: messagesContainer, 
        threshold: 0.1,
        rootMargin: '100px 0px 0px 0px'
      }
    )
    
    if (this.loadTriggerElement) {
      this.intersectionObserver.observe(this.loadTriggerElement)
    }
  }

  handleScroll() {
    if (this.componentRef?.directiveRef) {
      const element = this.componentRef.directiveRef.elementRef.nativeElement
      this.lastScrollTop = element.scrollTop
    }
  }

  loadMoreMessages() {
    if (this.dataService.loadingMoreMessages || 
        !this.dataService.hasMoreMessages || 
        !this.messages?.length || 
        this.scrollLock) {
      return
    }
    
    const scrollElement = this.componentRef.directiveRef.elementRef.nativeElement
    const oldScrollHeight = scrollElement.scrollHeight    
    this.scrollLock = true
    
    this.dataService.loadMoreMessages().subscribe({
      next: (result) => {
        if (result.addedCount > 0) {
          setTimeout(() => {
            const newScrollHeight = scrollElement.scrollHeight
            const heightDifference = newScrollHeight - oldScrollHeight
            scrollElement.scrollTop = this.lastScrollTop + heightDifference
            
            this.newMessagesCount = result.addedCount
            this.cdr.detectChanges()
            
            setTimeout(() => {
              this.newMessagesCount = 0
              this.cdr.detectChanges()
            }, 1000)
            
            this.scrollLock = false
          }, 10)
        } else {
          this.scrollLock = false
        }
      },
      error: () => {
        this.scrollLock = false
      }
    })
  }

  scrollToBottom(smooth = false) {
    if (this.componentRef?.directiveRef) {
      ScrollUtils.scrollToBottom(this.componentRef.directiveRef, smooth)
    }
  }
 
  openFilter() {
    this.isfilter = !this.isfilter
    if (!this.isfilter) {
      this.filterValue = ''
      this.messages = this.dataService.messages.getValue()
      this.cdr.detectChanges()
      if (this.messages.length) this.scrollToBottom()
    }
  }

  copyText(text: string) {
    this.clipboardApi.copyFromContent(text)
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

  filter() {
    this.messages = this.messagesAll.filter(
      (x) => x.text?.includes(this.filterValue)
    )
    this.cdr.detectChanges()
    if (this.messages.length) this.componentRef.directiveRef.scrollToBottom()
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
      this.showWarningSnackBar('Не выбран чат!')
      return false
    }
    fileInput.click()
  }
  
  uploadFiles(event) {
    if (!this.dataService.activChat) {
      this.showWarningSnackBar('Не выбран чат!')
      return false
    }
    if (event.files) this.fileService.UploadFile(event.files)
  }

  download(filename: string) {
    this.fileService.DownloadFile(filename)
  }

  remove(id: any) {
    this.signalRService.remove(id)
  }

  sendMsg() {
    if (!this.dataService.activChat) {
      this.showWarningSnackBar('Не выбран чат!')
      return false
    }

    if (!this.currentMsg?.text || 
        this.currentMsg.text === '' || 
        this.currentMsg.text.length > 25000) {
      this.showWarningSnackBar('Сообщение пустое или превышает разрешенный размер!')
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
          this.showSuccessSnackBar('Сообщение изменено')
        },
        () => {
          this.showErrorSnackBar('Ошибка отправки')
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
          this.showErrorSnackBar('Ошибка отправки')
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
      this.showWarningSnackBar('Не выбран чат!')
      return false
    }
    this.signalRService.sendCallRequest(this.dataService.activChatId)
  }

  isAllowedForUser() {
    if (!this.videoChatService.isSecureConnection()) {
      this.showErrorSnackBar('Видео-чат не доступен в небезопасном режиме')
      return false
    }

    return !this.dataService?.activChat?.groupId && this.dataService.user.role === 'lector'
  }

  showSuccessSnackBar(message: string) {
    this.toastr.success(message)
  }

  showWarningSnackBar(message: string) {
    this.toastr.warning(message)
  }

  showErrorSnackBar(message: string) {
    this.toastr.error(message)
  }
}
