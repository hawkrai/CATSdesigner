import { CreateEntity } from './../../models/form/create-entity.model';
import { ScheduleProtectionLab } from './../../models/lab.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {ConverterService} from "../converter.service";
import {Lab} from "../../models/lab.model";
import { UpdateLab } from 'src/app/models/form/update-lab.model';

@Injectable({
  providedIn: 'root'
})

export class LabsRestService {

  constructor(private http: HttpClient,
              private converterService: ConverterService) {}

  public getLabWork(subjectId: number): Observable<Lab[]> {
    return this.http.get('/Services/Labs/LabsService.svc/GetLabs/' + subjectId).pipe(
      map(res => this.converterService.labsWorkConverter(res['Labs']))
    );
  }

  public getProtectionSchedule(subjectId: number, groupId: string): Observable<{ labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[]}> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId);
    return this.http.get('Services/Labs/LabsService.svc/GetLabsV2', {params}).pipe(
      map(res => {
        return {labs: this.converterService.labsWorkConverter(res['Labs']),
          scheduleProtectionLabs: this.converterService.scheduleProtectionLabsConverter(res['ScheduleProtectionLabs'])}
      })
    )
  }

  public getMarks(subjectId: number, groupId: string): Observable<any> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId);
    return this.http.get('Services/Labs/LabsService.svc/GetMarksV2', {params}).pipe(
      map(res => res['Students']))
  }

  public createLab(lab: CreateEntity) {
    return this.http.post('Services/Labs/LabsService.svc/Save', lab);
  }

  public updateLabsOrder(objs: { Id: number, Order: number }[]) {
    return this.http.post('Services/Labs/LabsService.svc/UpdateLabsOrder', { objs });
  }

  public updateLabs(labs: UpdateLab[]) {
    return this.http.post('Services/Labs/LabsService.svc/UpdateLabs', { labs });
  }

  public deleteLab(lab: {id: string, subjectId: number}) {
    return this.http.post('Services/Labs/LabsService.svc/Delete', lab);
  }

  public createDateVisit(body: {subGroupId: any, date: string}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SaveScheduleProtectionDate', body);
  }

  public deleteDateVisit(body: {id: string}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/DeleteVisitingDate', body);
  }

  public setLabsVisitingDate(body): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SaveLabsVisitingData', body);
  }

  public setLabsMark(body): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SaveStudentLabsMark', body);
  }

  public getFilesLab(body: {subjectId: number, userId: number}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/GetFilesLab', body).pipe(
      map(res => res['UserLabFiles']));
  }

  public deleteUserFile(body: {id: string}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/DeleteUserFile', body);
  }

  public sendUserFile(body): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SendFile', body);
  }

  public getAllStudentFilesLab(subjectId: number, groupId: string): Observable<any> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId);
    return this.http.get('Services/Labs/LabsService.svc/GetFilesV2', {params}).pipe(
      map(res => res['Students']));
  }

  public receivedLabFile(body: {userFileId: number}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/ReceivedLabFile', body);
  }

  public cancelReceivedLabFile(body: {userFileId: number}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/CancelReceivedLabFile', body);
  }

  public checkPlagiarism(body: {subjectId: string, userFileId: number}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/CheckPlagiarism', body).pipe(
      map(res => res['DataD'])
    );
  }

  public checkPlagiarismSubjects(body: {subjectId: string, threshold: string, type: string}): Observable<any> {
    return this.http.post('api/Services/Labs/LabsService.svc/CheckPlagiarismSubjects', body).pipe(
      map(res => res['DataD'])
    );
  }
}
