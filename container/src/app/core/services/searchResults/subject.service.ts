import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { SubjectResponse } from '../../models/searchResults/subject.response'
import { GroupStatsStatistic } from '../../models/searchResults/group.stats'

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  api = '/Services/Parental/ParentalService.svc/'

  constructor(private http: HttpClient) {}

  getSubjects(groupName: any): Observable<SubjectResponse> {
    return this.http.get<SubjectResponse>(
      this.api + 'GetGroupSubjectsByGroupName/' + groupName
    )
  }

  loadGroup(groupId: number): Observable<GroupStatsStatistic> {
    return this.http.get<GroupStatsStatistic>(
      this.api + 'LoadGroup?groupId=' + groupId
    )
  }
}
