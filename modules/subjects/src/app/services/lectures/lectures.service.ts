import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {LecturesRestService} from './lectures-rest.service';
import {LoadLecturesCalendar} from '../../store/actions/lectures.actions';
import {getLecturesCalendar} from '../../store/selectors/lectures.selectors';
import {Observable} from 'rxjs';
import {Lecture} from '../../models/lecture.model';
import {map} from 'rxjs/operators';
import {GroupsVisiting, LecturesMarksVisiting} from '../../models/groupsVisiting.model';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LecturesService {

  constructor(private store$: Store<IAppState>,
              private rest: LecturesRestService) {
  }

  loadCalendar() {
    this.store$.dispatch(new LoadLecturesCalendar());
  }

  public getCalendar() {
    return this.store$.pipe(select(getLecturesCalendar));
  }

  public getAllLectures(subjectId: string): Observable<Lecture[]> {
    return this.rest.getAllLectures(subjectId);
  }

  public createLecture(lecture: Lecture) {
    return this.rest.createLecture(lecture);
  }

  public deleteLecture(lecture: {id: string, subjectId: string}) {
    return this.rest.deleteLecture(lecture);
  }

  public getLecturesMarkVisiting(subjectId: string, groupId: string): Observable<GroupsVisiting[]> {
    return this.rest.getLecturesMarkVisiting(subjectId, groupId);
  }

  public createDateVisit(body: {subjectId: string, date: string}) {
    this.rest.createDateVisit(body).subscribe(res => {
      res.Code === '200' && this.loadCalendar()
    })
  }

  public deleteDateVisit(body: {id: string}) {
    this.rest.deleteDateVisit(body).subscribe(res => {
      res.Code === '200' && this.loadCalendar()
    })
  }

  public deleteAllDate(body: {dateIds: string[]}) {
    this.rest.deleteAllDate(body).subscribe(res => {
      res.Code === '200' && this.loadCalendar()
    })
  }

  public setLecturesVisitingDate(body: {lecturesMarks: LecturesMarksVisiting[]}) {
    this.rest.setLecturesVisitingDate(body).subscribe(res => {
      res.Code === '200' && this.loadCalendar()
    })
  }
}
