import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  public getGroups(subjectId: string): Observable<any> {
    return this.http.get('Services/CoreService.svc/GetGroupsV2/' + subjectId)
  }

  public getDetachedGroups(subjectId: string): Observable<any> {
    return this.http.get('Services/CoreService.svc/GetGroupsV3/' + subjectId)
  }

  public getGroupsByUser(lecturerId: string): Observable<any> {
    return this.http.get(
      'Services/CoreService.svc/GetGroupsByUserV2/' + lecturerId
    )
  }
}
