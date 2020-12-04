import { CreateLectureEntity } from './../../models/form/create-lecture-entity.model';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import {Calendar} from "../../models/calendar.model";
import {Lecture} from "../../models/lecture.model";
import {GroupsVisiting, LecturesMarksVisiting} from "../../models/visiting-mark/groups-visiting.model";

@Injectable({
  providedIn: 'root'
})

export class LecturesRestService {

  constructor(private http: HttpClient) {}

  public getLectures(subjectId: number): Observable<Lecture[]> {
    return this.http.get('Services/Lectures/LecturesService.svc/GetLectures/' + subjectId).pipe(
      map(res => res['Lectures'])
    );
  }

  public saveLecture(lecture: CreateLectureEntity) {
    return this.http.post('Services/Lectures/LecturesService.svc/Save', lecture);
  }

  public updateLecturesOrder(subjectId: number, lectures: { Id: number, Order: number }[]) {
    return this.http.post('Services/Lectures/LecturesService.svc/UpdateLecturesOrder', { subjectId, lectures });
  }

  public deleteLecture(lecture: { id: number, subjectId: number }) {
    return this.http.post('Services/Lectures/LecturesService.svc/Delete', lecture);
  }

  public getCalendar(subjectId: number): Observable<Calendar[]> {
    return this.http.get('Services/Lectures/LecturesService.svc/GetCalendar/' + subjectId).pipe(
      map(res => res['Calendar'])
    );
  }

  public getLecturesMarkVisiting(subjectId: number, groupId: number): Observable<GroupsVisiting> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Services/Lectures/LecturesService.svc/GetLecturesMarkVisitingV2', {params}).pipe(
      map(res => res['GroupsVisiting'] ? res['GroupsVisiting'][0] : null)
    )
  }

  public createDateVisit(body: {subjectId: string, date: string}): Observable<any> {
    return this.http.post('Services/Lectures/LecturesService.svc/SaveDateLectures', body);
  }

  public deleteDateVisit(body: {id: string}): Observable<any> {
    return this.http.post('Services/Lectures/LecturesService.svc/DeleteVisitingDate', body);
  }

  public deleteAllDate(body: {dateIds: number[]}): Observable<any> {
    return this.http.post('Services/Lectures/LecturesService.svc/DeleteVisitingDates', body);
  }

  public setLecturesVisitingDate(body: {lecturesMarks: LecturesMarksVisiting[]}): Observable<any> {
    return this.http.post('Services/Lectures/LecturesService.svc/SaveMarksCalendarData', body);
  }
}
