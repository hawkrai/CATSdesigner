import { GroupsVisiting, LecturesMarksVisiting } from './../../models/visiting-mark/groups-visiting.model';
import { createAction, props } from '@ngrx/store';
import { Calendar } from 'src/app/models/calendar.model';

import { Lecture } from 'src/app/models/lecture.model';
import { CreateLectureEntity } from './../../models/form/create-lecture-entity.model';

export const loadCalendar = createAction(
  '[Lectures] Load Calendar'
);

export const loadCalendarSuccess = createAction(
  '[Lectures] Load Calendar Success',
  props<{ calendar: Calendar[] }>()
);

export const loadLectures = createAction(
  '[Lectures] Load Lectures'
);

export const loadLecturesSuccess = createAction(
  '[Lectures] Load Lectures Success',
  props<{ lectures: Lecture[] }>()
);

export const loadGroupsVisiting = createAction(
  '[Lectures] Load Groups Visiting'
);

export const loadGroupsVisitingSuccess = createAction(
  '[Lectures] Load Groups Visiting Success',
  props<{ groupsVisiting: GroupsVisiting }>()
);

export const resetLectures = createAction(
  '[Lectures] Reset Lectures'
);

export const saveLecture = createAction(
  '[Lectures] Save Lecture',
  props<{ lecture: CreateLectureEntity }>()
);

export const deleteLecture = createAction(
  '[Lectures] Delete Lecture',
  props<{ id: number }>()
);

export const updateOrder = createAction(
  '[Lectures] Update Order',
  props<{ prevIndex: number, currentIndex: number }>()
);

export const deleteAllDate = createAction(
  '[Lectures] Delete All Date'
);

export const setLecturesVisitingDate = createAction(
  '[Lectures] Set Lectures Visiting Date',
  props<{ lecturesMarks: LecturesMarksVisiting[] }>()
);

export const resetVisiting = createAction(
  '[Lectures] Reset Visiting'
);

export const createDateVisit = createAction(
  '[Lectures] Create Date Visit',
  props<{ obj: { date: string, startTime: string, endTime: string, building: string, audience: string } }>()
);

export const deleteDateVisit = createAction(
  '[Lectures] Delete Date Visit',
  props<{ id: number }>()
);

export const getVisitingExcel = createAction(
  '[Lectures] Get Visiting Excel'
);



