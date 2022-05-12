import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import {Subject} from '../models/subject.model';
import { Lector } from '../models/lector.model';
import { SubjectForm } from '../models/form/subject-form.model';
import { UniqueViewData } from '../models/unique.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  constructor(private http: HttpClient) {
  }

  public editSubject(subjectId: number): Observable<SubjectForm> {
    return this.http.get<SubjectForm>('Subject/EditSubject/' + subjectId);
  }

  public saveSubject(body: SubjectForm): Observable<any> {
    return this.http.post('Subject/SaveSubject', body);
  }

  public editGroups(subjectId: number, groupId: number): Observable<any> {
    return this.http.get(`Subject/SubGroups?subjectId=${subjectId}&groupId=${groupId}`);
  }

  public subGroupsChangeGroup(subjectId: number, groupId: string): Observable<any> {
    return this.http.post('Subject/SubGroupsChangeGroup', {subjectId, groupId});
  }

  public getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>('Subject/Subjects');
  }

  public getSubject(subjectId: number): Observable<Subject> {
    return this.http.get<Subject>('Subject/Subject/' + subjectId);
  }

  public deleteSubject(subjectId: number): Observable<any> {
    return this.http.get('Subject/DeleteSubject/' + subjectId);
  }

  public getCreateModel(): Observable<SubjectForm> {
    return this.http.get<SubjectForm>('Subject/Create');
  }

  public getAttachmentsAsZip(attachmentsIds: number[]): Observable<HttpResponse<ArrayBuffer>> {
    return this.http.post('Subject/GetAttachmentsAsZip', { attachmentsIds }, { responseType: 'arraybuffer', observe: 'response' });
  }

  public getLector(id: number): Observable<Lector> {
    return this.http.get(`Services/CoreService.svc/GetLecturer/${id}`).pipe(
      map(res => res['Lector'])
    );
  }

  public getJoinedLector(subjectId: number, loadSelf: boolean = false): Observable<Lector[]> {
    const params = new HttpParams()
      .set('loadSelf', loadSelf + '');
    return this.http.get('Services/CoreService.svc/GetJoinedLector/' + subjectId, { params }).pipe(
      map(res => res['Lectors'])
    );
  }

  public joinedLector(subjectId: number, lectorId: number): Observable<any> {
    return this.http.post('Services/CoreService.svc/JoinLector', {subjectId, lectorId});
  }

  public disjoinLector(subjectId: number, lectorId: number): Observable<any> {
    return this.http.post('Services/CoreService.svc/DisjoinLector', {subjectId, lectorId});
  }

  public getNoAdjointLectors(subjectId: number): Observable<Lector[]> {
    return this.http.get('Services/CoreService.svc/GetNoAdjointLectors/' + subjectId).pipe(
      map(res => res['Lectors'])
    );
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

  isUniqueSubjectName(subjectName: string, subjectId: number): Observable<UniqueViewData> {
    return this.http.post<UniqueViewData>('Services/Subjects/SubjectsService.svc/Name/Unique', { subjectName, subjectId });
  }

  isUniqueSubjectAbbreviation(subjectAbbreviation: string, subjectId: number) {
    return this.http.post<UniqueViewData>('Services/Subjects/SubjectsService.svc/Abbreviation/Unique', { subjectAbbreviation, subjectId });
  }
}

