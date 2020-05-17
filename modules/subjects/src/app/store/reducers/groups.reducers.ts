import {GroupsState, initialGroupsState} from '../state/groups.state';
import {EGroupsActions, GroupsActions} from '../actions/groups.actions';

export const groupsReducers = (state = initialGroupsState, action: GroupsActions): GroupsState => {
  switch (action.type) {
    case EGroupsActions.SET_GROUPS:
      return {
        ...state,
        groups: action.payload
      };

    case EGroupsActions.SET_CURRENT_GROUP:
      return {
        ...state,
        currentGroup: action.payload
      };

    default:
      return state;
  }
};
