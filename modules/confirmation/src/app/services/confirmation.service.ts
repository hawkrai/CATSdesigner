import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Group } from '../models/group.model'

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(private http: HttpClient) {}

  public getGroups(): Observable<any> {
    return this.http.get<any>('/Services/CoreService.svc/GetAllGroupsLite/')
  }

  getUserGroups() {
    return this.http.get<Group[]>(`/Services/CoreService.svc/GetUserGroups`)
  }

  public getStudents(groupId): Observable<any> {
    return this.http.get<any>(
      '/Services/CoreService.svc/GetStudentsByGroupId/' + groupId
    )
  }

  public confirmationStudent(studentId): Observable<any> {
    return this.http.post<any>(
      '/Services/CoreService.svc/ConfirmationStudent/' + studentId,
      {}
    )
  }

  public unconfirmationStudent(studentId): Observable<any> {
    return this.http.post<any>(
      '/Services/CoreService.svc/UnConfirmationStudent/' + studentId,
      {}
    )
  }
}
