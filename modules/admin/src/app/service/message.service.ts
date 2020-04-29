import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageResponse, DisplayMessage, Recipients } from '../model/message';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    api = 'Services/Messages/MessagesService.svc/';

    constructor(private http: HttpClient) {
    }

    getMessages(): Observable<MessageResponse> {
        return this.http.get<MessageResponse>(this.api + 'GetMessages/');
    }

    getMessage(messageId): Observable<DisplayMessage> {
        return this.http.get<DisplayMessage>(this.api + 'GetMessage/' + messageId);
    }

    saveMessage(id): Observable<void> {
        return this.http.post<void>(this.api + 'Delete', {  messageId: id });
    }

    deleteMessage(id): Observable<void> {
        return this.http.post<void>(this.api + 'Delete', {  messageId: id });
    }

    searchRecipients(searchValue): Observable<Recipients[]> {
        return this.http.get<Recipients[]>('/Message/GetSelectListOptions?term=' + searchValue);
    }
}
