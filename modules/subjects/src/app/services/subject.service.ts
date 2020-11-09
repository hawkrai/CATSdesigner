import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Subject} from '../models/subject.model';
import { SubjectForm } from '../models/subject-form.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private subjectsSub = new BehaviorSubject<Subject[]>([]);
  constructor(private http: HttpClient) {
  }

  public editSubject(subjectId: number): Observable<SubjectForm> {
    return this.http.get<SubjectForm>('Subject/EditSubject/' + subjectId);
  }

  public saveSubject(body: SubjectForm): Observable<any> {
    return this.http.post('Subject/SaveSubject', body);
  }

  public editGroups(subjectId: number): Observable<any> {
    return this.http.get('Subject/SubGroups?subjectId=' + subjectId);
  }

  public subGroupsChangeGroup(subjectId: number, groupId: string): Observable<any> {
    return this.http.post('Subject/SubGroupsChangeGroup', {subjectId, groupId});
  }

  public getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>('Subject/Subjects');
  }

  public deleteSubject(subjectId: number): Observable<any> {
    return this.http.get('Subject/DeleteSubject/' + subjectId);
  }

  public getCreateModel(): Observable<SubjectForm> {
    return this.http.get<SubjectForm>('Subject/Create');
  }

  public getJoinedLector(subjectId: number): Observable<any> {
    return this.http.get('Services/CoreService.svc/GetJoinedLector/' + subjectId);
  }

  public joinedLector(subjectId: number, lectorId: string): Observable<any> {
    return this.http.post('Services/CoreService.svc/JoinLector', {subjectId, lectorId});
  }

  public disjoinLector(subjectId: number, lectorId: string): Observable<any> {
    return this.http.post('Services/CoreService.svc/DisjoinLector', {subjectId, lectorId});
  }

  public getNoAdjointLectors(subjectId: number): Observable<any> {
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

