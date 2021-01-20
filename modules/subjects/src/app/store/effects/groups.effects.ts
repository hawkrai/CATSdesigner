import {Injectable} from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {map, switchMap} from 'rxjs/operators';
import {getSubjectId} from '../selectors/subject.selector';
import {GroupsRestService} from '../../services/groups/groups-rest.service';
import * as groupActions from '../actions/groups.actions';

@Injectable()
export class GroupsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: GroupsRestService
  ) {
  }

  getGroups$ = createEffect(() => this.actions$.pipe(
    ofType(groupActions.loadGroups),
    switchMap(() => this.store.select(getSubjectId)),
    switchMap(subjectId => this.rest.getAllGroups(subjectId)),
    map(groups => groupActions.loadGroupsSuccess({ groups }))
  ));

  getOldGroups$ = createEffect(() => this.actions$.pipe(
    ofType(groupActions.loadOldGroups),
    switchMap(() => this.store.select(getSubjectId)),
    switchMap(subjectId => this.rest.getAllOldGroups(subjectId)),
    map(groups => groupActions.loadGroupsSuccess({ groups }))
  ));
}
