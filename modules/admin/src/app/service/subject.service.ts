import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectResponse } from '../model/subject.response';
import {GroupStatsStatistic} from '../model/group.stats';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {

    api = '/Services/Parental/ParentalService.svc/';

    constructor(private http: HttpClient) {
    }

    getSubjects(groupName: any): Observable<SubjectResponse> {
        return this.http.get<SubjectResponse>(this.api + 'GetGroupSubjectsByGroupName/' + groupName);
    }

    getAllArchiveSubjects(username: string): Observable<any> {
      return this.http.post<any>('/Profile/GetProfileInfoSubjects?isArchive=true', {userLogin: username});
    }

    loadGroup(groupId): Observable<GroupStatsStatistic> {
      return this.http.get<GroupStatsStatistic>(this.api + '/LoadGroup?groupId=' + groupId);
    }

    loadGroupArchive(groupId): Observable<GroupStatsStatistic> {
      return this.http.get<GroupStatsStatistic>(this.api + '/LoadGroup?groupId=' + groupId + '&isArchive=true');
    }

    getUserInfo(id: string): Observable<any> {
      return this.http.get<any>('/Profile/GetProfileInfoById/' + id);
    }

}
