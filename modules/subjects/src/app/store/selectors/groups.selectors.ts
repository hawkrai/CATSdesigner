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
    state.currentGroup.SubGroupsOne ? state.currentGroup.SubGroupsOne.SubGroupId : null, 
    state.currentGroup.SubGroupsTwo ? state.currentGroup.SubGroupsTwo.SubGroupId : null, 
    state.currentGroup.SubGroupsThird ? state.currentGroup.SubGroupsThird.SubGroupId : null
  ].filter(id => id !== null) : []
);

export const isActiveGroup = createSelector(
  groupsSelector,
  state => state.isActive
)

export const hasInactiveGroups = createSelector(
  groupsSelector,
  state => state.hasInactiveGroups
)