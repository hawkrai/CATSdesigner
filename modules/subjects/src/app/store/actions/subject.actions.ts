import {Action} from "@ngrx/store";

export enum ESubjectActions {
  SET_SUBJECT_ID = '[Subject] Set Subject Id',
}

export class SetSubjectId implements Action{
  public readonly type = ESubjectActions.SET_SUBJECT_ID;

  constructor(public payload: string) {}
}

export type SubjectActions =  SetSubjectId;
