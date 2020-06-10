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

    getSubjects(groupId: any): Observable<SubjectResponse> {
        return this.http.get<SubjectResponse>(this.api + 'GetGroupSubjects/' + groupId);
    }

    loadGroup(groupId): Observable<GroupStatsStatistic> {
      return this.http.get<GroupStatsStatistic>(this.api + '/LoadGroup?groupId=' + groupId);
    }

}
