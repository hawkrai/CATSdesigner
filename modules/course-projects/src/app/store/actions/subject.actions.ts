import {Action} from '@ngrx/store';

export enum ESubjectActions {
  GetSubjectId = '[Subject] Get Subject Id',
  SetSubjectId = '[Subject] Set Subject Id',
}

export class GetSubjectId implements Action {
  public readonly type = ESubjectActions.GetSubjectId;
}

export class SetSubjectId implements Action {
  public readonly type = ESubjectActions.SetSubjectId;

  constructor(public payload: string) {}
}

export type SubjectActions = GetSubjectId | SetSubjectId;
