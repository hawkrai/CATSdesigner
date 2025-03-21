import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '@chat/shared/models/entities/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  private readonly baseUrl = 'catService/Message';

  constructor(private http: HttpClient) {}

  getChatMessages(userId: number, chatId: number, limit: number, offset: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.baseUrl}/GetChatMsgs?userId=${userId}&chatId=${chatId}&limit=${limit}&offset=${offset}`
    );
  }

  getGroupMessages(userId: number, chatId: number, limit: number, offset: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.baseUrl}/GetGroupMsgs?userId=${userId}&chatId=${chatId}&limit=${limit}&offset=${offset}`
    );
  }
}