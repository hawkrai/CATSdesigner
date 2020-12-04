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


export const getCurrentGroupSubGroupIds = createSelector(
  groupSelector,
  state => state.currentGroup ? [
    state.currentGroup.subGroupsOne ? state.currentGroup.subGroupsOne.subGroupId : null, 
    state.currentGroup.subGroupsTwo ? state.currentGroup.subGroupsTwo.subGroupId : null, 
    state.currentGroup.subGroupsThird ? state.currentGroup.subGroupsThird.subGroupId : null
  ].filter(id => id !== null) : []
);
