import {createSelector} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {GroupsState} from '../state/groups.state';

const groupSelector = (state: IAppState) => state.groups;

export const getGroups = createSelector(
  groupSelector,
  (state: GroupsState) => state.groups
);

export const getCurrentGroup = createSelector(
  groupSelector,
  (state: GroupsState) => state.currentGroup
);
