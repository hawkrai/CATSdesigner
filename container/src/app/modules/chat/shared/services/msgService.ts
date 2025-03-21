import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Message } from '@chat/shared/models/entities/message.model'
import { Observable } from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class MsgService {
  public user: any
  private messageOffset: number = 0
  public readonly defaultPageSize: number = 20

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
  }

  public resetMessageState() {
    this.messageOffset = 0
  }

  public load(chatId: number, isGroup: boolean, limit: number = this.defaultPageSize, offset: number = 0): Observable<Message[]> {
    if (isGroup) {
      return this.http.get<Message[]>(
        `catService/Message/GetGroupMsgs?userId=${this.user.id}&chatId=${chatId}&limit=${limit}&offset=${offset}`
      )
    } else {
      return this.http.get<Message[]>(
        `catService/Message/GetChatMsgs?userId=${this.user.id}&chatId=${chatId}&limit=${limit}&offset=${offset}`
      )
    }
  }

  public loadMoreMessages(chatId: number, isGroup: boolean): Observable<Message[]> {
    this.messageOffset += this.defaultPageSize
    return this.load(chatId, isGroup, this.defaultPageSize, this.messageOffset)
  }
}
