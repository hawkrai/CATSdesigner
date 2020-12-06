import {Group} from '../../models/group.model';

export interface IGroupsState {
  groups: Group[];
  currentGroup: Group;
}

export const initialGroupsState: IGroupsState = {
  groups: [],
  currentGroup: null
};
