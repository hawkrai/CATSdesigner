import {Action} from '@ngrx/store';
import {Calendar} from '../../models/calendar.model';

export enum ELecturesActions {
  LOAD_LECTURE_CALENDAR = '[Lectures] Load Lectures Calendar',
  SET_LECTURE_CALENDAR = '[Lectures] Set Lectures Calendar'
}

export class LoadLecturesCalendar implements Action {
  public readonly type = ELecturesActions.LOAD_LECTURE_CALENDAR;
}

export class SetLecturesCalendar implements Action {
  public readonly type = ELecturesActions.SET_LECTURE_CALENDAR;

  constructor(public payload: Calendar[]) {}
}

export type LecturesActions =
  LoadLecturesCalendar
  | SetLecturesCalendar;
