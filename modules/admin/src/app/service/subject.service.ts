import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { SubjectResponse } from '../model/subject.response'
import { GroupStatsStatistic } from '../model/group.stats'

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

  getAllArchiveSubjects(username: string): Observable<any> {
    return this.http.post<any>(
      '/Profile/GetProfileInfoSubjects?isArchive=true',
      { userLogin: username }
    )
  }

  loadGroup(groupId): Observable<GroupStatsStatistic> {
    return this.http.get<GroupStatsStatistic>(
      this.api + '/LoadGroup?groupId=' + groupId
    )
  }

  loadGroupByDates(groupId, start, end): Observable<GroupStatsStatistic> {
    if (start != undefined && end != undefined) {
      return this.http.get<GroupStatsStatistic>(
        this.api +
          '/LoadGroup?groupId=' +
          groupId +
          '&startDate=' +
          this.formatDate(start) +
          '&endDate=' +
          this.formatDate(end)
      )
    }
    return this.http.get<GroupStatsStatistic>(
      this.api + '/LoadGroup?groupId=' + groupId
    )
  }

  loadGroupArchiveByDates(
    groupId,
    start,
    end
  ): Observable<GroupStatsStatistic> {
    if (start != undefined && end != undefined) {
      return this.http.get<GroupStatsStatistic>(
        this.api +
          '/LoadGroup?groupId=' +
          groupId +
          '&isArchive=true' +
          '&startDate=' +
          this.formatDate(start) +
          '&endDate=' +
          this.formatDate(end)
      )
    }
    return this.http.get<GroupStatsStatistic>(
      this.api + '/LoadGroup?groupId=' + groupId + '&isArchive=true'
    )
  }

  formatDate(date: string): string {
    const splitted = date.split('-', 3)
    return splitted[2] + '-' + splitted[1] + '-' + splitted[0]
  }

  loadGroupArchive(groupId): Observable<GroupStatsStatistic> {
    return this.http.get<GroupStatsStatistic>(
      this.api + '/LoadGroup?groupId=' + groupId + '&isArchive=true'
    )
  }

  getUserInfo(id: string): Observable<any> {
    return this.http.get<any>('/Profile/GetProfileInfoById/' + id)
  }
}
