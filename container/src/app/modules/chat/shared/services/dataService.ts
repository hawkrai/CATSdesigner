import { Injectable } from '@angular/core'
import { Chat } from '../models/entities/chats.model'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Message } from '../models/entities/message.model'
import { MsgService } from './msgService'
import { BehaviorSubject } from 'rxjs'
import { ChatService } from './chatService'
import { Groups } from '../models/entities/groups.model'
import { exit } from 'process'
import { element } from 'protractor'
import { ContactService } from './contactService'
import { filter } from 'rxjs/operators'
import { SubjectGroups } from '../models/entities/subject.groups.model'
@Injectable({
  providedIn: 'root',
})
export class DataService {
  public files: any[] = []
  public activChat: any
  public activChatId: number
  public readMessageGroupCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0)
  public readMessageCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0)
  public readMessageChatCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0)
  public activGroup: Groups
  public activeSubject: SubjectGroups
  public chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Array<Chat>>([])
  public groups: BehaviorSubject<SubjectGroups[]> = new BehaviorSubject<
    Array<SubjectGroups>
  >([])
  public messages: BehaviorSubject<Message[]> = new BehaviorSubject<
    Array<Message>
  >([])
  public isGroupChat: boolean = false

  public user: any
  public isLecturer: boolean
  private fileUrl: string
  constructor(
    private http: HttpClient,
    private msgService: MsgService,
    private chatGroupService: ChatService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    if (this.user != null) {
      this.isLecturer = this.user.role == 'lector'
    } else {
      this.isLecturer = false
    }
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
    if (this.activChatId) {
      var subjectNum = this.getNumSubjectById(this.activChatId)
      if (subjectNum > -1) {
        var subjects = this.groups.getValue()
        this.readMessageCount.next(subjects[subjectNum].unread)
        this.readMessageGroupCount.next(
          this.readMessageGroupCount.getValue() - subjects[subjectNum].unread
        )
        subjects[subjectNum].unread = 0
        this.groups.next(subjects)
      } else {
        var groupNum
        ;[subjectNum, groupNum] = this.getNumGroupById(this.activChatId)
        var subjects = this.groups.getValue()
        this.readMessageCount.next(subjects[subjectNum].groups[groupNum].unread)
        this.readMessageGroupCount.next(
          this.readMessageGroupCount.getValue() -
            subjects[subjectNum].groups[groupNum].unread
        )
        subjects[subjectNum].groups[groupNum].unread = 0
        this.groups.next(subjects)
      }
    }

    this.msgService
      .load(this.activChatId, true)
      .subscribe((msgs: Message[]) => {
        this.messages.next(msgs)
      })
  }

  public LoadChatMsg() {
    this.msgService
      .load(this.activChatId, false)
      .subscribe((msgs: Message[]) => {
        this.messages.next(msgs)
      })
  }

  public updateMsg(chatId: number, msgId: number, text: string) {
    if (chatId == this.activChatId) {
      var messages = this.messages.getValue()
      var msgNum = messages.findIndex((x) => x.id == msgId)
      messages[msgNum].text = text
      this.messages.next(messages)
    }
  }

  public updateChats(chat, chatId) {
    chat.id = chatId
    this.chats.next(this.chats.getValue().concat(chat))
  }

  public AddMsg(msg: Message) {
    if (msg.chatId == this.activChatId) {
      this.messages.next(this.messages.getValue().concat(msg))
    } else {
      var chatNum = this.getNumChatById(msg.chatId)
      this.readMessageCount.next(-1)
      if (chatNum > -1) {
        var chats = this.chats.getValue()
        chats[chatNum].unread++
        this.chats.next(chats)
        this.readMessageChatCount.next(this.readMessageChatCount.getValue() + 1)
      } else {
        var subjectNum = this.getNumSubjectById(msg.chatId)
        this.readMessageGroupCount.next(
          this.readMessageGroupCount.getValue() + 1
        )
        if (subjectNum > -1) {
          var subjects = this.groups.getValue()
          subjects[subjectNum].unread++
          this.groups.next(subjects)
        } else {
          var groupNum
          ;[subjectNum, groupNum] = this.getNumGroupById(msg.chatId)
          var subjects = this.groups.getValue()
          subjects[subjectNum].groups[groupNum].unread++
          this.groups.next(subjects)
        }
      }
    }
  }

  public RemoveMsg(chatId: any, msgId: any) {
    if (chatId == this.activChatId) {
      var num = this.getNumMsgById(msgId)
      var msg = this.messages.getValue()
      msg.splice(num, 1)
      this.messages.next(msg)
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
    var sub = this.groups.getValue()
    var num = -1
    var subNum = -1
    var element
    for (var i = 0; i < sub.length; i++) {
      element = sub[i]
      subNum++
      num = element.groups.findIndex((x) => x.id == id)
      if (num > -1) {
        return [subNum, num]
      }
    }
    return [-1, -1]
  }

  private getNumMsgById(id: number): number {
    return this.messages.getValue().findIndex((x) => x.id == id)
  }
}
