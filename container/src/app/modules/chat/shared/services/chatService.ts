import { Injectable } from '@angular/core'
import { Chat } from '@chat/shared/models/entities/chats.model'
import { Observable } from 'rxjs'
import { SubjectGroups } from '@chat/shared/models/entities/subject.groups.model'
import { ChatApiService } from '@chat/shared/api/chat-api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public user: any
  constructor(private chatApiService: ChatApiService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
  }

  public updateRead(chatId: number) {
    return this.chatApiService.updateReadChat(this.user.id, chatId);
  }

  public updateGroupRead(chatId: number) {
    return this.chatApiService.updateReadGroupChat(this.user.id, chatId);
  }

  public loadChats(): Observable<Chat[]> {
    return this.chatApiService.getAllChats(this.user.id);
  }

  public loadGroups(): Observable<SubjectGroups[]> {
    return this.chatApiService.getAllGroups(this.user.id, this.user.role);
  }

  public LoadChat(chatId: number) {
    return this.chatApiService.getChatById(this.user.id, chatId);
  }
}
