import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ConverterService} from "../converter.service";
import {Calendar} from "../../models/calendar.model";
import {Lecture} from "../../models/lecture.model";
import {GroupsVisiting, LecturesMarksVisiting} from "../../models/groupsVisiting.model";

@Injectable({
  providedIn: 'root'
})

export class LecturesRestService {

  constructor(private http: HttpClient,
              private converterService: ConverterService) {}

  public getAllLectures(subjectId: number): Observable<Lecture[]> {
    return this.http.get('Services/Lectures/LecturesService.svc/GetLectures/' + subjectId).pipe(
      map(res => this.converterService.lecturesModelConverter(res['Lectures']))
    );
  }

  public createLecture(lecture: Lecture) {
    return this.http.post('Services/Lectures/LecturesService.svc/Save', lecture);
  }

  public updateLecturesOrder(objs: { Id: number, Order: number }[]) {
    return this.http.post('Services/Lectures/LecturesService.svc/UpdateLecturesOrder', { objs });
  }

  public deleteLecture(lecture: {id: string, subjectId: number}) {
    return this.http.post('Services/Lectures/LecturesService.svc/Delete', lecture);
  }

  public getCalendar(subjectId: number): Observable<Calendar[]> {
    return this.http.get('Services/Lectures/LecturesService.svc/GetCalendar/' + subjectId).pipe(
      map(res => this.converterService.calendarModelsConverter(res['Calendar']))
    );
  }

  public getLecturesMarkVisiting(subjectId: number, groupId: string): Observable<GroupsVisiting[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId);
    return this.http.get('Services/CoreService.svc/GetLecturesMarkVisitingV2', {params}).pipe(
      map(res => this.converterService.groupsVisitingConverter(res['GroupsVisiting']))
    )
  }

  public createDateVisit(body: {subjectId: string, date: string}): Observable<any> {
    return this.http.post('Services/Lectures/LecturesService.svc/SaveDateLectures', body);
  }

  public deleteDateVisit(body: {id: string}): Observable<any> {
    return this.http.post('Services/Lectures/LecturesService.svc/DeleteVisitingDate', body);
  }

  public deleteAllDate(body: {dateIds: string[]}): Observable<any> {
    return this.http.post('Services/Lectures/LecturesService.svc/DeleteVisitingDates', body);
  }

  public setLecturesVisitingDate(body: {lecturesMarks: LecturesMarksVisiting[]}): Observable<any> {
    return this.http.post('Services/Lectures/LecturesService.svc/SaveMarksCalendarData', body);
  }
}
