import {Group} from '../../models/group.model';

export interface GroupsState {
  groups: Group[];
  currentGroup: Group;
}

export const initialGroupsState: GroupsState = {
  groups: [],
  currentGroup: null
};
