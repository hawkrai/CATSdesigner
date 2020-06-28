import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageResponse, DisplayMessage, Recipients } from '../model/message';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    api = '/Services/Messages/MessagesService.svc/';

    constructor(private http: HttpClient) {
    }

    getMessages(): Observable<MessageResponse> {
        return this.http.get<MessageResponse>(this.api + 'GetMessages/');
    }

    getMessage(messageId): Observable<DisplayMessage> {
        return this.http.get<DisplayMessage>(this.api + 'GetMessage/' + messageId);
    }

    saveMessage(subject, body, recipients, attachments): Observable<string> {
        // attachments = [];
        const params = new HttpParams()
        .append('subject', subject)
        .append('body', body)
        .append('recipients', recipients)
        .append('attachments', attachments);
        // params = params.set('subject', subject);
        // params = params.set('body', body);
        // params = params.set('recipients', recipients);
        // params = params.set('attachments', []);
        return this.http.post<string>(this.api + 'Save', params);
    }

    deleteMessage(id): Observable<void> {
        return this.http.post<void>(this.api + 'Delete', {  messageId: id });
    }

    searchRecipients(searchValue): Observable<Recipients[]> {
        return this.http.get<Recipients[]>('/api/Message/GetSelectListOptions?term=' + searchValue);
    }
}
