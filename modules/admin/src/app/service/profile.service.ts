import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileProject, ProfileInfoSubject, ProfileInfo } from '../model/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    api = '/Profile/';
    apiAccount = '/Account/';

    constructor(private http: HttpClient) {
    }

    getProfileProjects(login: any): Observable<ProfileProject[]> {
        return this.http.post<ProfileProject[]>(this.api + 'GetUserProject', login);
    }

    getProfileInfoSubjects(login: any): Observable<ProfileInfoSubject[]> {
        return this.http.post<ProfileInfoSubject[]>(this.api + 'GetProfileInfoSubjects', login);
    }

    getProfileInfo(login: any): Observable<ProfileInfo> {
        return this.http.post<ProfileInfo>(this.api + 'GetProfileInfo', login);
    }
	
	getProfileProjectsById(Id: any): Observable<ProfileProject[]> {
    return this.http.get<ProfileProject[]>(this.api + 'GetUserProjectsById/' + Id);
  }

  getDpProfileProjects(Id: any): Observable<ProfileProject[]> {
    return this.http.get<ProfileProject[]>(this.api + 'GetDpUserProjectsById/' + Id);
  }

  getCpProfileProjects(Id: any): Observable<ProfileProject[]> {
    return this.http.get<ProfileProject[]>(this.api + 'GetCpUserProjectsById/' + Id);
  }

  getProfileInfoSubjectsById(Id: any): Observable<ProfileInfoSubject[]> {
    return this.http.get<ProfileInfoSubject[]>(this.api + 'GetProfileInfoSubjectsById/' + Id);
  }

  getAllProfileInfoSubjectsById(Id: any): Observable<ProfileInfoSubject[]> {
    return this.http.get<ProfileInfoSubject[]>(this.api + 'GetAllProfileInfoSubjectsById/' + Id);
  }

  getProfileInfoById(Id: any): Observable<ProfileInfo> {
    return this.http.get<ProfileInfo>(this.api + 'GetProfileInfoById/' + Id);
  }

  getAvatar(): Observable<string> {
    return this.http.get(this.apiAccount + 'GetAvatar', { responseType: 'text' });
  }
}
