import { ConverterService } from './../../services/converter.service';
import {Injectable} from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

import {IAppState} from '../state/app.state';
import {LabsRestService} from '../../services/labs/labs-rest.service';
import * as groupsSelector  from '../selectors/groups.selectors';
import * as labsActions from '../actions/labs.actions';
import * as labsSelectors from '../selectors/labs.selectors';
import * as subjectSelectors from '../selectors/subject.selector';

@Injectable()
export class LabsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: LabsRestService) {
  }

  schedule$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.loadLabsSchedule),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId),this.store.select(groupsSelector.getCurrentGroupId)),
    switchMap(([_, subjectId, groupId]) => this.rest.getProtectionSchedule(subjectId, groupId)),
    mergeMap(({ labs, scheduleProtectionLabs }) => [labsActions.loadLabsSuccess({ labs }), labsActions.laodLabsScheduleSuccess({ scheduleProtectionLabs })])
    )
  );

  updateOrder$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.updateOrder),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId), this.store.select(labsSelectors.getLabs)),
    switchMap(([{ prevIndex, currentIndex }, subjectId, labs]) => 
    this.rest.updateLabsOrder(subjectId, [{ Id: labs[prevIndex].LabId, Order: currentIndex + 1 }, { Id: labs[currentIndex].LabId, Order: prevIndex + 1 }]).pipe(
      map(() => labsActions.updateOrderSuccess({ prevIndex, currentIndex }))
    ))
  ));

  labs$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.loadLabs),
    switchMap(() => this.store.select(subjectSelectors.getSubjectId)),
    switchMap(subjectId => this.rest.getLabWork(subjectId).pipe(
      map(labs => labsActions.loadLabsSuccess({ labs }))
    ))
  ));

  deleteLab$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.deleteLab),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ id }, subjectId]) => this.rest.deleteLab({ id, subjectId }).pipe(
      map(() => labsActions.loadLabs())
    ))
  ));

  createLab$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.saveLab),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ lab }, subjectId]) => (lab.subjectId = subjectId, this.rest.saveLab(lab)).pipe(
      map(() => labsActions.loadLabs())
    ))
  ));

  createDateVisit$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.createDateVisit),
    switchMap(({ date, subGroupId }) => this.rest.createDateVisit(subGroupId, date).pipe(
      map(() => labsActions.loadLabsSchedule())
    ))
  ));

  deleteDateVisit$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.deleteDateVisit),
    switchMap(({ id }) => this.rest.deleteDateVisit(id).pipe(
      map(() => labsActions.loadLabsSchedule())
    ))
  ));
}
