import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { UserActivity } from '../model/userActivity'
import { ResetPassword } from '../model/resetPassword'
import { SubjectDepend } from '../model/subject.response'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = '/Administration/'

  constructor(private http: HttpClient) {}

  getUserActivity(): Observable<UserActivity> {
    return this.http.get<UserActivity>(this.api + 'UserActivityJson')
  }

  resetPassword(passwordModel): Observable<ResetPassword> {
    return this.http.post<ResetPassword>(
      this.api + 'ResetPasswordJson',
      passwordModel
    )
  }

  getListOfSubjectsByStudentId(studentId): Observable<SubjectDepend> {
    return this.http.get<SubjectDepend>(
      this.api + 'ListOfSubjectsByStudentJson/' + studentId
    )
  }

  getListOfAllSubjectsByStudentId(studentId): Observable<SubjectDepend> {
    return this.http.get<SubjectDepend>(
      this.api + 'ListOfAllSubjectsByStudentJson/' + studentId
    )
  }

  getListOfAllSubjectsByGroupId(groupId): Observable<SubjectDepend> {
    return this.http.get<SubjectDepend>(
      this.api + 'ListOfAllSubjectsByGroupJson/' + groupId
    )
  }
}
