import {Action} from '@ngrx/store';
import {Lab, ScheduleProtectionLab} from '../../models/lab.model';


export enum ELabsActions {
  LOAD_LABS = '[Labs] Load Labs',
  SET_LABS = '[Labs] Set Labs',
  LOAD_LABS_CALENDAR = '[Labs] Load Labs Calendar',
  SET_LABS_CALENDAR = '[Labs] Set Labs Calendar'
}

export class LoadLabs implements Action {
  public readonly type = ELabsActions.LOAD_LABS;
}

export class SetLabs implements Action{
  public readonly type = ELabsActions.SET_LABS;

  constructor(public payload: Lab[]) {}
}

export class LoadLabsCalendar implements Action{
  public readonly type = ELabsActions.LOAD_LABS_CALENDAR;
}

export class SetLabsCalendar implements Action{
  public readonly type = ELabsActions.SET_LABS_CALENDAR;

  constructor(public payload: ScheduleProtectionLab[]) {}
}

export type LabsActions =
  LoadLabs
  | SetLabs
  | LoadLabsCalendar
  | SetLabsCalendar;
