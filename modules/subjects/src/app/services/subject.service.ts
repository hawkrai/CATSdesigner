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
    return this.http.post('Subject/SubGroupsChangeGroup', {subjectId, groupId});
  }

  public getSubjects(): Observable<any> {
    return this.http.get('Subject/Subjects');
  }

  public deleteSubjects(subjectId: string): Observable<any> {
    return this.http.get('Subject/DeleteSubject/' + subjectId);
  }

  public getCreateModel(): Observable<any> {
    return this.http.get('Subject/Create');
  }

  public getJoinedLector(subjectId: string): Observable<any> {
    return this.http.get('Services/CoreService.svc/GetJoinedLector/' + subjectId);
  }

  public joinedLector(subjectId: string, lectorId: string): Observable<any> {
    return this.http.post('Services/CoreService.svc/JoinLector', {subjectId, lectorId});
  }

  public disjoinLector(subjectId: string, lectorId: string): Observable<any> {
    return this.http.post('Services/CoreService.svc/DisjoinLector', {subjectId, lectorId});
  }

  public getNoAdjointLectors(subjectId: string): Observable<any> {
    return this.http.get('Services/CoreService.svc/GetNoAdjointLectors/' + subjectId);
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

