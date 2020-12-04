import {createFeatureSelector, createSelector} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {IGroupsState} from '../state/groups.state';

const groupsSelector = createFeatureSelector<IAppState, IGroupsState>('groups');

export const getGroups = createSelector(
  groupsSelector,
  state => state.groups
);

export const getCurrentGroup = createSelector(
  groupsSelector,
  state => state.currentGroup
);

export const getCurrentGroupId = createSelector(
  getCurrentGroup,
  group => !!group ? group.GroupId : null
);


export const getCurrentGroupSubGroupIds = createSelector(
  groupsSelector,
  state => state.currentGroup ? [
    state.currentGroup.subGroupsOne ? state.currentGroup.subGroupsOne.SubGroupId : null, 
    state.currentGroup.subGroupsTwo ? state.currentGroup.subGroupsTwo.SubGroupId : null, 
    state.currentGroup.subGroupsThird ? state.currentGroup.subGroupsThird.SubGroupId : null
  ].filter(id => id !== null) : []
);
