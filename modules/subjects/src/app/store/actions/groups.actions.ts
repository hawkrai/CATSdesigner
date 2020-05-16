import {Action} from '@ngrx/store';
import {Group} from '../../models/group.model';


export enum EGroupsActions {
  LOAD_GROUPS = '[Groups] Load Groups',
  SET_GROUPS = '[Groups] Set Groups',
  SET_CURRENT_GROUP = '[Labs] Set current Group'
}

export class LoadGroups implements Action {
  public readonly type = EGroupsActions.LOAD_GROUPS;
}

export class SetGroups implements Action {
  public readonly type = EGroupsActions.SET_GROUPS;

  constructor(public payload: Group[]) {}
}

export class SetCurrentGroup implements Action{
  public readonly type = EGroupsActions.SET_CURRENT_GROUP;

  constructor(public payload: Group) {}
}

export type GroupsActions =
  LoadGroups
  | SetGroups
  | SetCurrentGroup;
