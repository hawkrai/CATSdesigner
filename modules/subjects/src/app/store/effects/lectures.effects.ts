import {Injectable} from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {IAppState} from '../state/app.state';
import {LecturesRestService} from '../../services/lectures/lectures-rest.service';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import * as lecturesActions from '../actions/lectures.actions';
import * as subjectSelectors from '../selectors/subject.selector';
import * as leacturesSelectors from '../selectors/lectures.selectors';
import * as groupsSelectors from '../selectors/groups.selectors';
import * as filesActions from '../actions/files.actions';
import * as catsActions from '../actions/cats.actions';
import { ScheduleService } from 'src/app/services/schedule.service';

@Injectable()
export class LecturesEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private scheduleService: ScheduleService,
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
      switchMap(body => [catsActions.showMessage({ body }), lecturesActions.loadLectures()])
    ))
  ));

  deleteLecture$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.deleteLecture),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ id }, subjectId]) => this.rest.deleteLecture({ id, subjectId }).pipe(
      switchMap(body => [catsActions.showMessage({ body }), lecturesActions.loadLectures()])
    ))
  ));

  updateOrder$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.updateOrder),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ prevIndex, currentIndex }, subjectId]) => 
    this.rest.updateLecturesOrder(subjectId, prevIndex, currentIndex))
  ), { dispatch: false });

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
      switchMap(body => [catsActions.showMessage({ body }), lecturesActions.loadGroupsVisiting()])
    ))
  ));

  createDateVisit$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.createDateVisit),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ obj }, subjectId]) => this.scheduleService.createLectureDateVisit({ ...obj, subjectId }).pipe(
      map(() => lecturesActions.loadCalendar())
    ))
  ));

  deleteDateVisit$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.deleteDateVisit),
    switchMap(({ id }) => this.scheduleService.deleteLectureDateVisit(id).pipe(
      map(() => lecturesActions.loadCalendar())
    ))
  ));

  downloadExcel$ = createEffect(() => this.actions$.pipe(
    ofType(lecturesActions.getVisitingExcel),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId), this.store.select(groupsSelectors.getCurrentGroupId)),
    switchMap(([_, subjectId, groupId]) => this.rest.getVisitingExcel(subjectId, groupId).pipe(
      map((response) => filesActions.getExcelData({ response }))
    ))
  ));
}
