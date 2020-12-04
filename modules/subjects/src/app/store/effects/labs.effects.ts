import { ConverterService } from './../../services/converter.service';
import { LabsService } from './../../services/labs/labs.service';
import {Injectable} from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

import {IAppState} from '../state/app.state';
import {LabsRestService} from '../../services/labs/labs-rest.service';
import {getCurrentGroup} from '../selectors/groups.selectors';
import {Group} from '../../models/group.model';
import * as labsActions from '../actions/labs.actions';
import * as subjectSelectors from '../selectors/subject.selector';

@Injectable()
export class LabsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private converterService: ConverterService,
              private rest: LabsRestService) {
  }

  schedule$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.loadLabsSchedule),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId),this.store.select(getCurrentGroup)),
    switchMap(([_, subjectId, group]: [Action, number, Group]) => this.rest.getProtectionSchedule(subjectId, group.groupId)),
    mergeMap(({ labs, scheduleProtectionLabs }) => [labsActions.loadLabsSuccess({ labs }), labsActions.laodLabsScheduleSuccess({ scheduleProtectionLabs })])
    )
  );

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
    ofType(labsActions.createLab),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ lab }, subjectId]) => (lab.subjectId = subjectId, this.rest.createLab(lab)).pipe(
      map(() => labsActions.loadLabs())
    ))
  ));

  updateLabs$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.updateLabs),
    map(({ labs }) => this.converterService.labsUpdateConverter(labs)),
    switchMap(labs => this.rest.updateLabs(labs))
  ), { dispatch: false });
}
