import {createSelector} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {GroupsState} from '../state/groups.state';


export const getGroups = createSelector(
  (state: IAppState) => state.groups,
  (state: GroupsState) => state.groups
);

export const getCurrentGroup = createSelector(
  (state: IAppState) => state.groups,
  (state: GroupsState) => state.currentGroup
);
