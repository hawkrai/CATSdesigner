import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileProject, ProfileInfoSubject, ProfileInfo } from '../../models/searchResults/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  api = '/Profile/';
  apiAccount = '/Account/';


  constructor(private http: HttpClient) {
  }
  getProfileProjects(Id: any): Observable<ProfileProject[]> {
    return this.http.get<ProfileProject[]>(this.api + 'GetUserProjectsById/' + Id);
  }

  getProfileInfoSubjects(Id: any): Observable<ProfileInfoSubject[]> {
    return this.http.get<ProfileInfoSubject[]>(this.api + 'GetProfileInfoSubjectsById/' + Id);
  }

  getProfileInfo(Id: any): Observable<ProfileInfo> {
    return this.http.get<ProfileInfo>(this.api + 'GetProfileInfoById/' + Id);
  }

  getDefaultAvatar(): Observable<string> {
    return this.http.get(this.apiAccount + 'GetDefaultAvatar', { responseType: 'text' });
  }

  getAvatar(): Observable<string> {
    return this.http.get(this.apiAccount + 'GetAvatar', { responseType: 'text' });
  }



}
