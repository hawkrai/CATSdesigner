import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ConverterService} from "./converter.service";
import {Lab} from "../models/lab.model";

@Injectable({
  providedIn: 'root'
})

export class LabService {

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

}
