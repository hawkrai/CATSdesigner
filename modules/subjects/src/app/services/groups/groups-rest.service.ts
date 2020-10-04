import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from "../../models/group.model";
import { map } from "rxjs/operators";
import { ConverterService } from "../converter.service";

@Injectable({
  providedIn: 'root'
})
export class GroupsRestService {

  private allGroups: Observable<Group[]>;

  constructor(private http: HttpClient,
              private converterService: ConverterService) { }

  public getAllGroups(subjectId: number): Observable<any> {
    return this.http.get('Services/CoreService.svc/GetGroupsV2/' + subjectId).pipe(
      map(res => this.converterService.groupsModelConverter(res['Groups']))
    );
  }

  public getAllOldGroups(subjectId: number): Observable<any> {
    return this.http.get('Services/CoreService.svc/GetGroupsV3/' + subjectId).pipe(
      map(res => this.converterService.groupsModelConverter(res['Groups']))
    );
  }
}
