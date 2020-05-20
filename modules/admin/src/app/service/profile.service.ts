import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileProject, ProfileInfoSubject, ProfileInfo } from '../model/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    api = '/Profile/';

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
}
