import {Injectable} from '@angular/core';
// import {select, Store} from '@ngrx/store';
// import {IAppState} from '../../store/state/app.state';
// import {LecturesRestService} from './lectures-rest.service';
// import {LoadLecturesCalendar} from '../../store/actions/lectures.actions';
// import {getLecturesCalendar} from '../../store/selectors/lectures.selectors';
// import {Observable} from 'rxjs';
// import {Lecture} from '../../models/lecture.model';
// import {GroupsVisiting, LecturesMarksVisiting} from '../../models/visiting-mark/groups-visiting.model';

@Injectable({
  providedIn: 'root'
})

export class LecturesService {

  // constructor(private store$: Store<IAppState>,
  //             private rest: LecturesRestService) {
  // }

  // loadCalendar() {
  //   this.store$.dispatch(new LoadLecturesCalendar());
  // }

  // public getCalendar() {
  //   return this.store$.pipe(select(getLecturesCalendar));
  // }

  // public getAllLectures(subjectId: number): Observable<Lecture[]> {
  //   return this.rest.getAllLectures(subjectId);
  // }

  // public createLecture(lecture: Lecture) {
  //   return this.rest.createLecture(lecture);
  // }

  // public updateLecturesOrder(objs: { Id: number, Order: number }[]) {
  //   return this.rest.updateLecturesOrder(objs);
  // }

  // public deleteLecture(lecture: {id: string, subjectId: number}) {
  //   return this.rest.deleteLecture(lecture);
  // }

  // public getLecturesMarkVisiting(subjectId: number, groupId: string): Observable<GroupsVisiting[]> {
  //   return this.rest.getLecturesMarkVisiting(subjectId, groupId);
  // }

  // public createDateVisit(body: {subjectId: string, date: string}) {
  //   this.rest.createDateVisit(body).subscribe(res => {
  //     res.Code === '200' && this.loadCalendar()
  //   })
  // }

  // public deleteDateVisit(body: {id: string}) {
  //   this.rest.deleteDateVisit(body).subscribe(res => {
  //     res.Code === '200' && this.loadCalendar()
  //   })
  // }

  // public deleteAllDate(body: {dateIds: string[]}) {
  //   this.rest.deleteAllDate(body).subscribe(res => {
  //     res.Code === '200' && this.loadCalendar()
  //   })
  // }


  // public setLecturesVisitingDate(body: {lecturesMarks: LecturesMarksVisiting[]}) {
  //   this.rest.setLecturesVisitingDate(body).subscribe(res => {
  //     res.Code === '200' && this.loadCalendar()
  //   })
  // }
}
