import {Injectable} from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import {getSubjectId} from '../selectors/subject.selector';
import {GroupsRestService} from '../../services/groups/groups-rest.service';
import * as groupsActions from '../actions/groups.actions';
import * as groupsSelectors from '../selectors/groups.selectors';
import * as subjectSelectors from '../selectors/subject.selector';
import { iif } from 'rxjs';

@Injectable()
export class GroupsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: GroupsRestService
  ) {
  }

  loadActiveGroups$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.loadActiveGroups),
    switchMap(() => this.store.select(getSubjectId)),
    switchMap(subjectId => this.rest.getAllGroups(subjectId)),
    map(groups => groupsActions.loadGroupsSuccess({ groups }))
  ));

  loadOldGroups$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.loadOldGroups),
    switchMap(() => this.store.select(getSubjectId)),
    switchMap(subjectId => this.rest.getAllOldGroups(subjectId)),
    map(groups => groupsActions.loadGroupsSuccess({ groups }))
  ));

  loadStudentGroup$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.loadStudentGroup),
    withLatestFrom(
      this.store.select(subjectSelectors.getSubjectId),
      this.store.select(subjectSelectors.getUserId)
    ),
    switchMap(([_, subjectId, userId]) => this.rest.getUserSubjectGroup(subjectId, userId).pipe(
      map(group => groupsActions.setCurrentGroup({ group }))
    ))
  ));

  triggerGridActiveState$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.triggerGroupActiveState),
    withLatestFrom(this.store.select(groupsSelectors.isActiveGroup)),
    map(([, isActive]) => groupsActions.setActiveState({ isActive }))
  ));

  loadGroupsTrigger$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.setActiveState),
    map(() => groupsActions.loadGroups())
  ));

  loadGroups$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.loadGroups),
    withLatestFrom(this.store.select(groupsSelectors.isActiveGroup)),
    map(([_, isActive]) => isActive ? groupsActions.loadActiveGroups() : groupsActions.loadOldGroups())
  ));
}
