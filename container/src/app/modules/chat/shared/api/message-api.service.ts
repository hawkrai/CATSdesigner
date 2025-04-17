import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Message } from '@chat/shared/models/entities/message.model'

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  private readonly baseUrl = 'catService/Message'

  constructor(private http: HttpClient) {}

  getChatMessages(
    userId: number,
    chatId: number,
    limit: number,
    offset: number
  ): Observable<Message[]> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('chatId', chatId.toString())
      .set('limit', limit.toString())
      .set('offset', offset.toString())
    return this.http.get<Message[]>(`${this.baseUrl}/GetChatMsgs`, { params })
  }

  getGroupMessages(
    userId: number,
    chatId: number,
    limit: number,
    offset: number
  ): Observable<Message[]> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('chatId', chatId.toString())
      .set('limit', limit.toString())
      .set('offset', offset.toString())
    return this.http.get<Message[]>(`${this.baseUrl}/GetGroupMsgs`, { params })
  }

  searchMessages(
    userId: number,
    chatId: number,
    isGroupChat: boolean,
    searchText: string,
    limit: number,
    offset: number
  ): Observable<Message[]> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('chatId', chatId.toString())
      .set('isGroupChat', isGroupChat.toString())
      .set('searchText', searchText)
      .set('limit', limit.toString())
      .set('offset', offset.toString())
    return this.http.get<Message[]>(`${this.baseUrl}/SearchMessages`, {
      params,
    })
  }
}
