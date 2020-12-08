import {Injectable} from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {IAppState} from '../state/app.state';
import {LecturesRestService} from '../../services/lectures/lectures-rest.service';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import * as lecturesActions from '../actions/lectures.actions';
import * as subjectSelectors from '../selectors/subject.selector';
import * as leacturesSelectors from '../selectors/lectures.selectors';
import * as groupsSelectors from '../selectors/groups.selectors';

@Injectable()
export class LecturesEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: LecturesRestService) {
  }

  loadgroupsVisiting$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.loadGroupsVisiting),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId), this.store.select(groupsSelectors.getCurrentGroupId)),
    switchMap(([_, subjectId, groupId]) => this.rest.getLecturesMarkVisiting(subjectId, groupId).pipe(
      map(groupsVisiting => lecturesActions.loadGroupsVisitingSuccess({ groupsVisiting }))
    ))
  ));

  loadCalendar$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.loadCalendar),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([_, subjectId]) => this.rest.getCalendar(subjectId).pipe(
      map(calendar => lecturesActions.loadCalendarSuccess({ calendar }))
    ))
  ));

  loadLectures$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.loadLectures),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([_, subjectId]) => this.rest.getLectures(subjectId).pipe(
      map(lectures => lecturesActions.loadLecturesSuccess({ lectures }))
    ))
  ));

  saveLecture$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.saveLecture),
    switchMap(({ lecture }) => this.rest.saveLecture(lecture).pipe(
      map(() => lecturesActions.loadLectures())
    ))
  ));

  deleteLecture$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.deleteLecture),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ id }, subjectId]) => this.rest.deleteLecture({ id, subjectId }).pipe(
      map(() => lecturesActions.loadLectures())
    ))
  ));

  updateOrder$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.updateOrder),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId), this.store.select(leacturesSelectors.getLectures)),
    switchMap(([{ prevIndex, currentIndex }, subjectId, lectures]) => 
    this.rest.updateLecturesOrder(subjectId, [{ Id: lectures[prevIndex].LecturesId, Order: currentIndex + 1 }, { Id: lectures[currentIndex].LecturesId, Order: prevIndex + 1 }]).pipe(
      map(() => lecturesActions.updateOrderSuccess({ prevIndex, currentIndex }))
    ))
  ));

  deleteAllDate$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.deleteAllDate),
    withLatestFrom(this.store.select(leacturesSelectors.getCalendar)),
    switchMap(([_, calendar]) => this.rest.deleteAllDate({ dateIds: calendar.map(d => d.Id)}).pipe(
      map(() => lecturesActions.loadCalendar())
    ))
  ));

  setLecturesMarksVisiting = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.setLecturesVisitingDate),
    switchMap(({ lecturesMarks }) => this.rest.setLecturesVisitingDate({ lecturesMarks }).pipe(
      map(() => lecturesActions.loadGroupsVisiting())
    ))
  ));

  downloadExcel = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.downloadExcel),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId), this.store.select(groupsSelectors.getCurrentGroupId)),
    tap(([_, subjectId, groupId]) => {
      // window.open(`/Statistic/GetVisitLecture?subjectId=${subjectId}&groupId=${groupId}`, '_blank')
    })
  ), { dispatch: false});

  createDateVisit$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.createDateVisit),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ date }, subjectId]) => this.rest.createDateVisit(subjectId, date).pipe(
      map(() => lecturesActions.loadCalendar())
    ))
  ));

  deleteDateVisit$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.deleteDateVisit),
    switchMap(({ id }) => this.rest.deleteDateVisit(id).pipe(
      map(() => lecturesActions.loadCalendar())
    ))
  ));
}
