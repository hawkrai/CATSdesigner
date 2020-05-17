import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {getSubjectId} from '../selectors/subject.selector';
import {GroupsRestService} from '../../services/groups/groups-rest.service';
import {EGroupsActions, LoadGroups, SetGroups} from '../actions/groups.actions';
import {Group} from '../../models/group.model';

@Injectable()
export class GroupsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: GroupsRestService
  ) {
  }

  @Effect()
  getGroups$ = this.actions$.pipe(
    ofType<LoadGroups>(EGroupsActions.LOAD_GROUPS),
    withLatestFrom(this.store.pipe(select(getSubjectId))),
    switchMap(([_, subjectId]) => this.rest.getAllGroups(subjectId)),
    map((groups: Group[]) => {
      return new SetGroups(groups)
    })
  );
}
