import { Injectable } from '@angular/core'
import { Chat } from '../models/entities/chats.model'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Message } from '../models/entities/message.model'
import { MsgService } from './msgService'
import { BehaviorSubject, Observable } from 'rxjs'
import { DataService } from './dataService'
import { ChatCto } from '../models/dto/chatCto'
import { User } from '../models/dto/user'
import { SubjectGroups } from '../models/entities/subject.groups.model'
@Injectable({
  providedIn: 'root',
})
export class ContactService {
  public user: any
  public isLecturer: boolean
  public contacts: BehaviorSubject<Chat[]> = new BehaviorSubject<Array<Chat>>(
    []
  )
  public openChatComand: BehaviorSubject<Chat> = new BehaviorSubject<Chat>(null)
  public isChatOpen: boolean
  constructor(private http: HttpClient, private dataService: DataService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.isLecturer = this.user.role == 'lector'
  }

  public openCaht(chat: Chat) {
    this.isChatOpen = true
    this.openChatComand.next(chat)
  }

  public CreateChat(userId: number) {
    var chatCto = new ChatCto(userId, this.user.id)
    return this.http.post<number>('catService/chat/CreateChat', chatCto)
  }

  public updateChats(fUserId, sUserId, chatId) {
    if (this.dataService.user.id == sUserId) {
      var contact = this.contacts.getValue().find((x) => x.userId == fUserId)
      contact.id = chatId
      this.dataService.updateChats(contact, chatId)
    }
  }

  public SetStatus(id: number, isOnline: boolean): void {
    var contacts = this.contacts.getValue()
    var contactNum = contacts.findIndex((x) => x.userId == id)
    if (contactNum > -1) {
      contacts[contactNum].isOnline = isOnline
      this.contacts.next(contacts)
    }
  }

  public loadContacts(filter: string) {
    var contacts = new Array<Chat>()
    var chats = this.dataService.chats.getValue()
    this.http
      .get<Array<User>>('catService/chat/GetAllLecturers?filter=' + filter)
      .subscribe((res) => {
        res.forEach((element) => {
          if (element.userId != this.user.id) {
            var chat = new Chat()
            chat.name = element.fullName
            chat.profilePicture = element.profile
            chat.userId = element.userId
            contacts.push(chat)
          }
        })
        if (this.isLecturer) {
          this.http
            .get<Array<User>>('catService/chat/GetAllStudents?filter=' + filter)
            .subscribe((res) => {
              res.forEach((element) => {
                if (element.userId != this.user.id) {
                  var chat = new Chat()
                  chat.name = element.fullName
                  chat.groupId = element.groupId
                  chat.profilePicture = element.profile
                  chat.userId = element.userId
                  contacts.push(chat)
                }
              })
              this.contacts.next(contacts)
            })
        } else {
          this.contacts.next(contacts)
        }
      })
  }

  public loadGroups(): Observable<SubjectGroups[]> {
    return this.http.get<SubjectGroups[]>(
      'catService/chat/GetAllGroups?userId=' +
        this.user.id +
        '&role=' +
        this.user.role
    )
  }
}
