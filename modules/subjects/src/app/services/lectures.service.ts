import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ConverterService} from "./converter.service";
import {Calendar} from "../models/calendar.model";
import {Lecture} from "../models/lecture.model";
import {GroupsVisiting} from "../models/groupsVisiting.model";

@Injectable({
  providedIn: 'root'
})

export class LecturesService {

  constructor(private http: HttpClient,
              private converterService: ConverterService) {}

  public getAllLectures(subjectId: string): Observable<Lecture[]> {
    return this.http.get('Services/Lectures/LecturesService.svc/GetLectures/' + subjectId).pipe(
      map(res => this.converterService.lecturesModelConverter(res['Lectures']))
    );
  }

  public getCalendar(subjectId: string): Observable<Calendar[]> {
    return this.http.get('Services/Lectures/LecturesService.svc/GetCalendar/' + subjectId).pipe(
      map(res => this.converterService.calendarModelsConverter(res['Calendar']))
    );
  }

  public getLecturesMarkVisiting(subjectId: string, groupId: string): Observable<GroupsVisiting[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId)
      .set('groupId', groupId);
    return this.http.get('Services/CoreService.svc/GetLecturesMarkVisitingV2', {params}).pipe(
      map(res => this.converterService.groupsVisitingConverter(res['GroupsVisiting']))
    )
  }
}
