import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient) { }

  public getAllGroups(subjectId: number): Observable<any> {
    return this.http.get('Services/CoreService.svc/GetGroupsV2/' + subjectId);
  }
}
