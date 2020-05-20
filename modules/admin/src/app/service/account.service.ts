import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse } from '../model/file';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    api = '/Account/';

    constructor(private http: HttpClient) {
    }

    verifySecretQuestion(userName, questionId, answer): Observable<boolean> {
        return this.http.get<boolean>(this.api + 'VerifySecretQuestion?userName=' + userName
        + '&questionId=' + questionId + '&answer=' + answer);
    }

    getDefaultAvatar(): Observable<string>  {
        return this.http.get(this.api + 'GetAvatar', { responseType: 'text'});
    }
}
