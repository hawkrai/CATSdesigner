import { CreateLessonEntity } from './../../models/form/create-lesson-entity.model';
import { StudentMark } from './../../models/student-mark.model';
import { CreateEntity } from './../../models/form/create-entity.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {ConverterService} from "../converter.service";
import {Lab, ScheduleProtectionLabs} from "../../models/lab.model";
import { UpdateLab } from 'src/app/models/form/update-lab.model';

@Injectable({
  providedIn: 'root'
})

export class LabsRestService {

  constructor(private http: HttpClient) {}

  public getLabWork(subjectId: number): Observable<Lab[]> {
    return this.http.get('/Services/Labs/LabsService.svc/GetLabs/' + subjectId).pipe(
      map(res => res['Labs'])
    );
  }

  public getProtectionSchedule(subjectId: number, groupId: number): Observable<{ labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLabs[]}> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Services/Labs/LabsService.svc/GetLabsV2', {params}).pipe(
      map(res => {
        return {labs: res['Labs'],
          scheduleProtectionLabs: res['ScheduleProtectionLabs']}
      })
    )
  }

  // public getMarks(subjectId: number, groupId: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('subjectId', subjectId.toString())
  //     .set('groupId', groupId);
  //   return this.http.get('Services/Labs/LabsService.svc/GetMarksV2', {params}).pipe(
  //     map(res => res['Students']))
  // }

  public getMarksV2(subjectId: number, groupId: number): Observable<StudentMark[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Services/Labs/LabsService.svc/GetMarksV3', {params}).pipe(
      map(res => res['Students']))
  }

  public saveLab(lab: CreateLessonEntity) {
    return this.http.post('Services/Labs/LabsService.svc/Save', lab);
  }

  public updateLabsOrder(objs: { Id: number, Order: number }[]) {
    return this.http.post('Services/Labs/LabsService.svc/UpdateLabsOrder', { objs });
  }

  public updateLabs(labs: UpdateLab[]) {
    return this.http.post('Services/Labs/LabsService.svc/UpdateLabs', { labs });
  }

  public deleteLab(lab: { id: number, subjectId: number }) {
    return this.http.post('Services/Labs/LabsService.svc/Delete', lab);
  }

  public createDateVisit(body: { subGroupId: number, date: string }): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SaveScheduleProtectionDate', body);
  }

  public deleteDateVisit(body: { id: number }): Observable<any> {
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

  public getAllStudentFilesLab(subjectId: number, groupId: number): Observable<any> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Services/Labs/LabsService.svc/GetFilesV2', {params}).pipe(
      map(res => res['Students']));
  }

  public receivedLabFile(body: {userFileId: number}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/ReceivedLabFile', body);
  }

  public cancelReceivedLabFile(body: {userFileId: number}): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/CancelReceivedLabFile', body);
  }

  public checkPlagiarism(body: {subjectId: number, userFileId: number }): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/CheckPlagiarism', body).pipe(
      map(res => res['DataD'])
    );
  }

  public checkPlagiarismSubjects(body: {subjectId: number, threshold: string, type: string}): Observable<any> {
    return this.http.post('api/Services/Labs/LabsService.svc/CheckPlagiarismSubjects', body).pipe(
      map(res => res['DataD'])
    );
  }
}
