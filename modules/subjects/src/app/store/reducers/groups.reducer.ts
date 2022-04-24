import { createReducer, on } from '@ngrx/store';
import {IGroupsState, initialGroupsState} from '../state/groups.state';
import * as groupActions from '../actions/groups.actions';

export const groupsReducer = createReducer(
  initialGroupsState,
  on(groupActions.loadGroupsSuccess, (state, { groups, groupId }): IGroupsState => ({
    ...state,
    groups,
    currentGroup: groups.find(x => x.GroupId === groupId) || groups[0]
  })),
  on(groupActions.setCurrentGroup, (state, action): IGroupsState => ({
    ...state,
    currentGroup: action.group
  })),
  on(groupActions.setCurrentGroupById, (state, action): IGroupsState => ({
    ...state,
    currentGroup: state.groups.find(g => g.GroupId === action.id)
  })),
  on(groupActions.setActiveState, (state, { isActive }): IGroupsState => ({
    ...state,
    isActive
  }))
);
