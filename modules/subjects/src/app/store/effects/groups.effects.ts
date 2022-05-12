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

@Injectable()
export class GroupsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: GroupsRestService
  ) {
  }

  loadActiveGroups$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.loadActiveGroups),
    switchMap(({ groupId }) => this.store.select(getSubjectId).pipe(
      switchMap(subjectId => this.rest.getAllGroups(subjectId)),
      switchMap(({groups, hasInactiveGroups }) => [groupsActions.loadGroupsSuccess({ groups, groupId }), groupsActions.checkHasInactiveSuccess({ hasInactiveGroups })])
    ))
  ));

  loadOldGroups$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.loadOldGroups),
    switchMap(({ groupId }) => this.store.select(getSubjectId).pipe(
      switchMap(subjectId => this.rest.getAllOldGroups(subjectId)),
      map(groups => groupsActions.loadGroupsSuccess({ groups, groupId }))
    ))
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
    map(() => groupsActions.loadGroups({ groupId: null }))
  ));

  loadGroups$ = createEffect(() => this.actions$.pipe(
    ofType(groupsActions.loadGroups),
    withLatestFrom(this.store.select(groupsSelectors.isActiveGroup)),
    map(([{ groupId }, isActive]) => isActive ? groupsActions.loadActiveGroups({ groupId }) : groupsActions.loadOldGroups({ groupId }))
  ));
}
