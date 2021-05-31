import { Injectable } from '@angular/core';
import { Chat } from '../tabs/chats/chats.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Message } from '../index/chat.model';
import { SubjectGroups } from '../tabs/groups/subject.groups.model';
import { MessageCto } from '../Dto/messageCto';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class MsgService {
    public user:any;
    
    constructor(private http: HttpClient) {
        this.user=JSON.parse(localStorage.getItem('currentUser'));
     }

    public load(chatId:number,isGroup:boolean): Observable<Message[]> {
        if(isGroup)
        {
            return this.http.get<Message[]>('catService/Message/GetGroupMsgs?userId='+this.user.id+'&chatId='+chatId);
        }
        else
        {
            return this.http.get<Message[]>('catService/Message/GetChatMsgs?userId='+this.user.id+'&chatId='+chatId);
        }
    }
}