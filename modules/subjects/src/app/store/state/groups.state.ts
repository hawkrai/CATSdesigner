import { Group } from '../../models/group.model'

export interface IGroupsState {
  groups: Group[]
  currentGroup: Group
  isActive: boolean
  hasInactiveGroups: boolean
}

export const initialGroupsState: IGroupsState = {
  groups: [],
  currentGroup: null,
  isActive: true,
  hasInactiveGroups: false,
}
