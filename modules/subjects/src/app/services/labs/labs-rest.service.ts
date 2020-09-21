import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {ConverterService} from "../converter.service";
import {Lab} from "../../models/lab.model";

@Injectable({
  providedIn: 'root'
})

export class LabsRestService {

  constructor(private http: HttpClient,
              private converterService: ConverterService) {}

  public getLabWork(subjectId: string): Observable<Lab[]> {
    return this.http.get('/Services/Labs/LabsService.svc/GetLabs/' + subjectId).pipe(
      map(res => this.converterService.labsWorkConverter(res['Labs']))
    );
  }
  public getProtectionSchedule(subjectId: string, groupId: string): Observable<any> {
    const params = new HttpParams()
      .set('subjectId', subjectId)
      .set('groupId', groupId);
    return this.http.get('Services/Labs/LabsService.svc/GetLabsV2', {params}).pipe(
      map(res => {
        return {labs: this.converterService.labsWorkConverter(res['Labs']),
          scheduleProtectionLabs: this.converterService.scheduleProtectionLabsConverter(res['ScheduleProtectionLabs'])}
      })
    )
  }

  public getMarks(subjectId: string, groupId: string): Observable<any> {
    const params = new HttpParams()
      .set('subjectId', subjectId)
      .set('groupId', groupId);
    return this.http.get('Services/Labs/LabsService.svc/GetMarksV2', {params}).pipe(
      map(res => res['Students']))
  }

  public createLab(lab: Lab) {
    return this.http.post('Services/Labs/LabsService.svc/Save', lab);
  }

  public deleteLab(lab: {id: string, subjectId: string}) {
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

  public getFilesLab(body: {subjectId: string, userId: number}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/GetFilesLab', body).pipe(
      map(res => res['UserLabFiles']));
  }

  public deleteUserFile(body: {id: string}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/DeleteUserFile', body);
  }

  public sendUserFile(body): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SendFile', body);
  }

  public getAllStudentFilesLab(subjectId: string, groupId: string): Observable<any> {
    const params = new HttpParams()
      .set('subjectId', subjectId)
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
