import { Injectable } from '@angular/core'
import { Chat } from '../models/entities/chats.model'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Message } from '../models/entities/message.model'
import { MsgService } from './msgService'
import { BehaviorSubject, Observable } from 'rxjs'
import { SubjectGroups } from '../models/entities/subject.groups.model'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public user: any
  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
  }

  public updateRead(chatId: number) {
    return this.http.get<Chat[]>(
      'catService/chat/UpdateReadChat?userId=' +
        this.user.id +
        '&chatId=' +
        chatId
    )
  }

  public updateGroupRead(chatId: number) {
    return this.http.get<Chat[]>(
      'catService/chat/UpdateReadGroupChat?userId=' +
        this.user.id +
        '&chatId=' +
        chatId
    )
  }

  public loadChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(
      'catService/chat/GetAllChats?userId=' + this.user.id
    )
  }

  public loadGroups(): Observable<SubjectGroups[]> {
    return this.http.get<SubjectGroups[]>(
      'catService/chat/GetAllGroups?userId=' +
        this.user.id +
        '&role=' +
        this.user.role
    )
  }

  public LoadChat(chatId: number) {
    return this.http.get<any>(
      'catService/chat/GetChatById?userId=' + this.user.id + '&chatId=' + chatId
    )
  }
}
