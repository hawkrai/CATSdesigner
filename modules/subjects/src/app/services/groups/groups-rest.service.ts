import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from "../../models/group.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GroupsRestService {


  constructor(private http: HttpClient) { }

  public getAllGroups(subjectId: number): Observable<Group[]> {
    return this.http.get('Services/CoreService.svc/GetGroupsV2/' + subjectId).pipe(
      map(res => res['Groups'])
    );
  }

  public getAllOldGroups(subjectId: number): Observable<Group[]> {
    return this.http.get('Services/CoreService.svc/GetGroupsV3/' + subjectId).pipe(
      map(res => res['Groups'])
    );
  }

  public getUserSubjectGroup(subjectId: number, userId: number): Observable<Group> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('userId', userId.toString());
    return this.http.get('Services/CoreService.svc/GetUserSubjectGroup', { params }).pipe(
      map(res => res['Group'])
    );
  }
}




