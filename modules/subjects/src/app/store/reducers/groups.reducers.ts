import { createReducer, on } from '@ngrx/store';
import {GroupsState, initialGroupsState} from '../state/groups.state';
import * as groupActions from '../actions/groups.actions';

export const groupsReducers = createReducer(
  initialGroupsState,
  on(groupActions.loadGroupsSuccess, (state, action): GroupsState => ({
    ...state,
    groups: action.groups,
    currentGroup: action.groups && action.groups.length ? action.groups[0] : null
  })),
  on(groupActions.setCurrentGroup, (state, action): GroupsState => ({
    ...state,
    currentGroup: action.group
  })),
  on(groupActions.setCurrentGroupById, (state, action): GroupsState => ({
    ...state,
    currentGroup: state.groups.find(g => g.groupId === action.id)
  })),
  on(groupActions.resetGroups, (state): GroupsState => ({
    ...state,
    currentGroup: null,
    groups: []
  }))
);
