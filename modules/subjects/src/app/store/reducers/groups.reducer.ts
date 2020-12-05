import { createReducer, on } from '@ngrx/store';
import {IGroupsState, initialGroupsState} from '../state/groups.state';
import * as groupActions from '../actions/groups.actions';

export const groupsReducer = createReducer(
  initialGroupsState,
  on(groupActions.loadGroupsSuccess, (state, action): IGroupsState => ({
    ...state,
    groups: action.groups,
    currentGroup: action.groups && action.groups.length ? action.groups[0] : null
  })),
  on(groupActions.setCurrentGroup, (state, action): IGroupsState => ({
    ...state,
    currentGroup: action.group
  })),
  on(groupActions.setCurrentGroupById, (state, action): IGroupsState => ({
    ...state,
    currentGroup: state.groups.find(g => g.GroupId === action.id)
  })),
  on(groupActions.resetGroups, (state): IGroupsState => ({
    ...state,
    currentGroup: null,
    groups: []
  }))
);
