import { Injectable, NgZone } from '@angular/core'
import { Chat } from '../models/entities/chats.model'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Message } from '../models/entities/message.model'
import { MsgService } from './msgService'
import { BehaviorSubject, Observable, from, of } from 'rxjs'
import { ChatService } from './chatService'
import { Groups } from '../models/entities/groups.model'
import { map, catchError, finalize } from 'rxjs/operators'
import { SubjectGroups } from '../models/entities/subject.groups.model'
import { ILoadMessagesResult } from '../models/interfaces/loadMessagesResult.interface'

@Injectable({
  providedIn: 'root',
})

export class DataService {
  public files: any[] = []
  public activChat: any
  public activChatId: number
  public readMessageGroupCount: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public readMessageCount: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public readMessageChatCount: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public activGroup: Groups
  public activeSubject: SubjectGroups
  public chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Array<Chat>>([])
  public groups: BehaviorSubject<SubjectGroups[]> = new BehaviorSubject<Array<SubjectGroups>>([])
  public messages: BehaviorSubject<Message[]> = new BehaviorSubject<Array<Message>>([])
  public isGroupChat: boolean = false

  public user: any
  public isLecturer: boolean
  public hasMoreMessages: boolean = true
  public loadingMoreMessages: boolean = false
  public loadingMessagesStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public loadMessagesTimer: any = null
  private loadingTimeout: any = null

  constructor(
    private http: HttpClient,
    private msgService: MsgService,
    private chatGroupService: ChatService,
    private zone: NgZone
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.isLecturer = this.user?.role === 'lector'
  }

  public LoadChats(): void {
    this.chatGroupService.loadChats().subscribe((result: Chat[]) => {
      var unread = 0
      result.forEach((elem) => {
        if (elem.unread) unread += elem.unread
      })
      this.readMessageChatCount.next(unread)
      this.chats.next(result)
    })
  }

  public LoadGroup(): void {
    this.chatGroupService.loadGroups().subscribe((result: SubjectGroups[]) => {
      var unread = 0
      result.forEach((elem) => {
        if (elem.unread) unread += elem.unread
        elem.groups.forEach((element) => {
          if (elem.unread) unread += element.unread
        })
      })
      this.readMessageGroupCount.next(unread)
      this.groups.next(result)
    })
  }

  public updateRead() {
    this.chatGroupService.updateRead(this.activChatId).subscribe()
  }

  public groupRead() {
    this.chatGroupService.updateGroupRead(this.activChatId).subscribe()
  }

  public SetStatus(id: number, isOnline: boolean): void {
    var chats = this.chats.getValue()
    var chatNum = chats.findIndex((x) => x.userId == id)
    if (chatNum > -1) {
      chats[chatNum].isOnline = isOnline
      this.chats.next(chats)
    }
  }

  public LoadGroupMsg() {
    this.resetMessageState()

    if (this.activChatId) {
      var subjectNum = this.getNumSubjectById(this.activChatId)
      if (subjectNum > -1) {
        const subjects = this.groups.getValue()
        this.readMessageCount.next(subjects[subjectNum].unread)
        this.readMessageGroupCount.next(
          this.readMessageGroupCount.getValue() - subjects[subjectNum].unread
        )
        subjects[subjectNum].unread = 0
        this.groups.next(subjects)
      } else {
        var groupNum
        [subjectNum, groupNum] = this.getNumGroupById(this.activChatId)
        if (subjectNum > -1 && groupNum > -1) {
          const subjects = this.groups.getValue()
          this.readMessageCount.next(subjects[subjectNum].groups[groupNum].unread)
          this.readMessageGroupCount.next(
            this.readMessageGroupCount.getValue() - subjects[subjectNum].groups[groupNum].unread
          )
          subjects[subjectNum].groups[groupNum].unread = 0
          this.groups.next(subjects)
        }
      }
    }

    this.setLoadingMessagesState(true)

    const loadingTimeout = setTimeout(() => {
      this.setLoadingMessagesState(false)
    }, 5000)

    this.msgService.load(this.activChatId, true)
    .subscribe({
      next: (msgs: Message[]) => {
        clearTimeout(loadingTimeout)
        this.processLoadedMessages(msgs)
      },
      error: (error) => {
        clearTimeout(loadingTimeout)
        console.error('Error loading group messages:', error)
        this.hasMoreMessages = false
        this.messages.next([])
        this.setLoadingMessagesState(false)
      }
    })
  }

  public LoadChatMsg() {
    this.resetMessageState()
    
    this.setLoadingMessagesState(true)

    const loadingTimeout = setTimeout(() => {
      this.setLoadingMessagesState(false)
    }, 5000)

    this.msgService.load(this.activChatId, false)
      .subscribe({
        next: (msgs: Message[]) => {
          clearTimeout(loadingTimeout)
          this.processLoadedMessages(msgs)
        },
        error: (error) => {
          clearTimeout(loadingTimeout)
          console.error('Error loading chat messages:', error)
          this.hasMoreMessages = false
          this.messages.next([])
          this.setLoadingMessagesState(false)
        }
      })
  }

  private processLoadedMessages(msgs: Message[]) {
    if (msgs.length < this.msgService.defaultPageSize) {
      this.hasMoreMessages = false
    }
    
    if (msgs.length === 0) {
      this.hasMoreMessages = false
      this.messages.next([])
    } else {
      this.messages.next([...msgs].reverse())
    }
    
    this.setLoadingMessagesState(false)
  }

  private resetMessageState() {
    this.msgService.resetMessageState()
    this.hasMoreMessages = true
    this.messages.next([])
  }

  public loadMoreMessages(): Observable<ILoadMessagesResult> {
    if (this.loadingMoreMessages || !this.hasMoreMessages) {
      return of({ addedCount: 0, totalCount: this.messages.getValue().length })
    }

    if (this.loadMessagesTimer) {
      clearTimeout(this.loadMessagesTimer)
    }
    
    this.loadingMoreMessages = true
    
    const currentMessages = this.messages.getValue()
    const currentMessagesCount = currentMessages.length
    
    return from(
      new Promise<ILoadMessagesResult>((resolve, reject) => {
        this.loadMessagesTimer = setTimeout(() => {
          this.msgService
            .loadMoreMessages(this.activChatId, this.isGroupChat)
            .pipe(
              finalize(() => {
                this.loadingMoreMessages = false
              })
            )
            .subscribe({
              next: (msgs: Message[]) => {
                if (msgs.length === 0 || msgs.length < this.msgService.defaultPageSize) {
                  this.hasMoreMessages = false
                }
                
                if (msgs.length > 0) {
                  const newMessages = [...msgs.reverse(), ...currentMessages]
                  this.messages.next(newMessages)
                  
                  resolve({
                    addedCount: msgs.length,
                    totalCount: newMessages.length
                  })
                } else {
                  resolve({
                    addedCount: 0,
                    totalCount: currentMessagesCount
                  })
                }
              },
              error: (error) => {
                console.error('Error loading more messages:', error)
                this.hasMoreMessages = false
                this.loadingMoreMessages = false
                
                reject(error)
              }
            })
        }, 100)
      })
    )
  }

  public updateMsg(chatId: number, msgId: number, text: string) {
    if (chatId == this.activChatId) {
      var messages = this.messages.getValue()
      var msgNum = messages.findIndex((x) => x.id == msgId)
      if (msgNum !== -1) {
        messages[msgNum].text = text
        this.messages.next(messages)
      }
    }
  }

  public updateChats(chat, chatId) {
    chat.id = chatId
    this.chats.next(this.chats.getValue().concat(chat))
  }

  public AddMsg(msg: Message) {
    if (msg.chatId == this.activChatId) {
      this.messages.next([...this.messages.getValue(), msg])
    } else {
      const chatNum = this.getNumChatById(msg.chatId)
      this.readMessageCount.next(-1)
      if (chatNum > -1) {
        const chats = this.chats.getValue()
        chats[chatNum].unread++
        this.chats.next(chats)
        this.readMessageChatCount.next(this.readMessageChatCount.getValue() + 1)
      } else {
        var subjectNum = this.getNumSubjectById(msg.chatId)
        this.readMessageGroupCount.next(
          this.readMessageGroupCount.getValue() + 1
        )
        if (subjectNum > -1) {
          const subjects = this.groups.getValue()
          subjects[subjectNum].unread++
          this.groups.next(subjects)
        } else {
          let groupNum
          [subjectNum, groupNum] = this.getNumGroupById(msg.chatId)
          if (subjectNum > -1 && groupNum > -1) {
            const subjects = this.groups.getValue()
            subjects[subjectNum].groups[groupNum].unread++
            this.groups.next(subjects)
          }
        }
      }
    }
  }

  public RemoveMsg(chatId: any, msgId: any) {
    if (chatId == this.activChatId) {
      const num = this.getNumMsgById(msgId)
      if (num > -1) {
        const msg = this.messages.getValue()
        msg.splice(num, 1)
        this.messages.next(msg)
      }
    }
  }

  public SendImg(formData: FormData) {
    return this.http.post('catService/file/UploadFile', formData)
  }

  private getNumChatById(id: number): number {
    return this.chats.getValue().findIndex((x) => x.id == id)
  }

  private getNumSubjectById(id: number): number {
    return this.groups.getValue().findIndex((x) => x.id == id)
  }

  private getNumGroupById(id: number): [number, number] {
    const subjects = this.groups.getValue()
    for (let i = 0; i < subjects.length; i++) {
      const num = subjects[i].groups.findIndex((x) => x.id == id)
      if (num > -1) {
        return [i, num]
      }
    }
    return [-1, -1]
  }

  private getNumMsgById(id: number): number {
    return this.messages.getValue().findIndex((x) => x.id == id)
  }

  private setLoadingMessagesState(isLoading: boolean): void {
    this.zone.run(() => {
      this.loadingMoreMessages = isLoading
      this.loadingMessagesStatus.next(isLoading)
      
      if (isLoading && !this.loadingTimeout) {
        this.loadingTimeout = setTimeout(() => {
          this.setLoadingMessagesState(false)
        }, 5000)
      } else if (!isLoading && this.loadingTimeout) {
        clearTimeout(this.loadingTimeout)
        this.loadingTimeout = null
      }
    })
  }
}
