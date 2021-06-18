import { Injectable } from '@angular/core';
import { Chat } from '../tabs/chats/chats.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Message } from '../index/chat.model';
import { SubjectGroups } from '../tabs/groups/subject.groups.model';
import { MessageCto } from '../Dto/messageCto';
import { MsgService } from './msgService';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../Dto/user';
import { DataService } from './dataService';
import { ChatCto } from '../Dto/chatCto';
@Injectable({
    providedIn: 'root',
})
export class ContactService {
    public user: any;
    public isLecturer: boolean;
    public contacts: BehaviorSubject<Chat[]> = new BehaviorSubject<Array<Chat>>([]);

    constructor(private http: HttpClient, private dataService: DataService) {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.isLecturer = this.user.role == "lector";
    }

    public CreateChat(userId: number) {
        var chatCto = new ChatCto(userId, this.user.id);
        return this.http.post<number>('catService/chat/CreateChat', chatCto);
    }

    public updateChats(fUserId, sUserId, chatId) {
        if (this.dataService.user.id == sUserId) {
            var contact = this.contacts.getValue().find(x => x.userId == fUserId);
            contact.id = chatId;
            this.dataService.updateChats(contact, chatId);
        }
    }

    public SetStatus(id: number, isOnline: boolean): void {
        var contacts = this.contacts.getValue();
        var contactNum = contacts.findIndex(x => x.userId == id);
        if (contactNum>-1) {
            contacts[contactNum].isOnline = isOnline;
            this.contacts.next(contacts);
        }
    }

    public loadContacts(filter: string) {
        var contacts = new Array<Chat>();
        var chats = this.dataService.chats.getValue();
        this.http.get<Array<User>>('catService/chat/GetAllLecturers?filter=' + filter).subscribe(res => {
            res.forEach(element => {
                if (element.userId != this.user.id) {
                    var chat = new Chat();
                    chat.name = element.fullName;
                    chat.profilePicture = element.profile
                    chat.userId = element.userId;
                    contacts.push(chat)
                }
            })
            if (this.isLecturer) {
                this.http.get<Array<User>>('catService/chat/GetAllStudents?filter=' + filter).subscribe(res => {
                    res.forEach(element => {
                        if (element.userId != this.user.id) {
                            var chat = new Chat();
                            chat.name = element.fullName;
                            chat.groupId = element.groupId;
                            chat.profilePicture = element.profile
                            chat.userId = element.userId;
                            contacts.push(chat)
                        }
                    })
                    this.contacts.next(contacts);
                });
            }
            else {
                this.contacts.next(contacts);
            }
        });

    }

    public loadGroups(): Observable<SubjectGroups[]> {
        return this.http.get<SubjectGroups[]>('catService/chat/GetAllGroups?userId=' + this.user.id + "&role=" + this.user.role)
    }
}