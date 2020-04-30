import {Group} from '../../models/group.model';

export interface GroupsState {
  groups: Group[];
}

export const initialGroupsState: GroupsState = {
  groups: []
}
