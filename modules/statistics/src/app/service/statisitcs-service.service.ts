import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class StatisitcsServiceService {
  constructor(private http: HttpClient) {}

  getSubjectOwner(groupId: any): Observable<any> {
    return this.http.get<any>(
      '/Services/Parental/ParentalService.svc/LoadGroup?groupId=' + groupId
    )
  }

  getLabsStastics(groupId: any): Observable<any> {
    return this.http.get<any>(
      '/Services/Parental/ParentalService.svc/LoadGroup?groupId=' + groupId
    )
  }

  getUserStastics(): Observable<any> {
    return this.http.get<any>(
      '/Services/Parental/ParentalService.svc/LoadStudent'
    )
  }

  getArchiveStatistics(groupId: any): Observable<any> {
    return this.http.get<any>(
      '/Services/Parental/ParentalService.svc/LoadGroup?groupId=' +
        groupId +
        '&isArchive=true'
    )
  }

  getPracticalStastics(subjectId: any, groupId: any): Observable<any> {
    return this.http.get<any>(
      '/Services/Practicals/PracticalService.svc/GetMarks?subjectID=' +
        subjectId +
        '&groupID=' +
        groupId
    )
  }

  getAllSubjects(username: string): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoSubjects', {
      userLogin: username,
    })
  }

  getAllArchiveSubjects(username: string): Observable<any> {
    return this.http.post<any>(
      '/Profile/GetProfileInfoSubjects?isArchive=true',
      { userLogin: username }
    )
  }

  getUserInfo(id: string): Observable<any> {
    return this.http.get<any>('/Profile/GetProfileInfoById/' + id)
  }

  getTeacherStatistics(): Observable<any> {
    return this.http.get<any>(
      '/Services/Statistics/StatisticsService.svc/GetTeacherStatistics'
    )
  }

  getCheckedType(subjectId: any): Observable<any> {
    return this.http.get<any>(
      '/Services/Subjects/SubjectsService.svc/Modules/' + subjectId
    )
  }

  round(value: any): number {
    return Math.round(value * 10) / 10
  }

  getGroupsBySubjectId(id: number): Observable<any> {
    return this.http.get<any>('/Services/CoreService.svc/GetGroupsV2/' + id)
  }
}
