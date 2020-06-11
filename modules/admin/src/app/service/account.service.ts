import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Login} from '../model/login';
import {ResetPasswordJson} from '../model/resetPassword';
import {RegisterModel} from '../model/student';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    api = '/api/Account/';

    constructor(private http: HttpClient) {
    }

    verifySecretQuestion(userName, questionId, answer): Observable<string> {
        return this.http.post<string>(this.api + 'VerifySecretQuestion?userName=' + userName
        + '&questionId=' + questionId + '&answer=' + answer, {});
    }

    getDefaultAvatar(): Observable<string> {
        return this.http.get(this.api + 'GetAvatar', { responseType: 'text'});
    }

    login(userName, password): Observable<Login> {
      return this.http.post<Login>(this.api + 'Login?userName=' + userName + '&password=' + password,  {});
    }

    logOff() {
      return this.http.post<Login>(this.api + 'LogOff',  {});
    }

    register(registerModel: RegisterModel) {
      return this.http.post(this.api + 'Register', registerModel);
    }

    usersExist(username) {
      return this.http.get(this.api + 'UserExists?userName=' + username);
    }

    resetPassword(resetPasswordModel: ResetPasswordJson) {
      return this.http.post(this.api + 'ResetPassword', resetPasswordModel);
    }

}
