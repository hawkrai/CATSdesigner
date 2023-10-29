import { Action } from '@ngrx/store'
import { User } from '../../models/User'

export enum ESubjectActions {
  SET_SUBJECT = '[Subject] Set Subject',
  SET_USER = '[Subject] Set User',
}

export class SetSubject implements Action {
  public readonly type = ESubjectActions.SET_SUBJECT

  constructor(public payload: { id: ''; Name: '' }) {}
}

export class SetUser implements Action {
  public readonly type = ESubjectActions.SET_USER

  constructor(public payload: User) {}
}

export type SubjectActions = SetSubject | SetUser
