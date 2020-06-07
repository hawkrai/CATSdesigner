import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient) {
  }

  public editSubject(subjectId: string): Observable<any> {
    return this.http.get('Subject/EditSubject/' + subjectId);
  }

  public saveSubject(body): Observable<any> {
    return this.http.post('Subject/SaveSubject', body);
  }

  public editGroups(subjectId: string): Observable<any> {
    return this.http.get('Subject/SubGroups?subjectId=' + subjectId);
  }

  public subGroupsChangeGroup(subjectId: string, groupId: string): Observable<any> {
    return this.http.post('subject/subgroupschangegroup', {subjectId, groupId});
  }

  public saveSubGroup(body: any): Observable<any> {
    const  form = new FormData();
    form.append('subjectId', body.subjectId);
    form.append('groupId', body.groupId);
    form.append('subGroupFirstIds', body.subGroupFirstIds);
    form.append('subGroupSecondIds', body.subGroupSecondIds);
    form.append('subGroupThirdIds', body.subGroupThirdIds);
    return this.http.post('Subject/SaveSubGroup', form);
  }
}

