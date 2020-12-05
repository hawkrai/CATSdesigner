import { createAction, props } from '@ngrx/store';
import { CreateLessonEntity } from 'src/app/models/form/create-lesson-entity.model';
import {Lab, ScheduleProtectionLabs } from '../../models/lab.model';

export const loadLabs = createAction(
  '[Labs] Load Labs'
);

export const loadLabsSuccess = createAction(
  '[Labs] Load Labs Success',
  props<{ labs: Lab[] }>()
);

export const loadLabsSchedule = createAction(
  '[Labs] Load Labs Schedule'
);

export const laodLabsScheduleSuccess = createAction(
  '[Labs] Load Labs Schedule Success',
  props<{ scheduleProtectionLabs: ScheduleProtectionLabs[] }>()
);

export const saveLab = createAction(
  '[Labs] Save Lab',
  props<{ lab: CreateLessonEntity }>()
);

export const deleteLab = createAction(
  '[Labs] Delete Lab',
  props<{ id: number }>()
);

export const updateLabs = createAction(
  '[Labs] Update Labs',
  props<{ labs: Lab[] }>()
);

export const resetLabs = createAction(
  '[Labs] Reset Labs'
);

export const updateOrder = createAction(
  '[Labs] Update Order',
  props<{ prevIndex: number, currentIndex: number }>()
);

export const updateOrderSuccess = createAction(
  '[Labs] Update Order Success',
  props<{ prevIndex: number, currentIndex: number }>()
);

export const createDateVisit = createAction(
  '[Labs] Create Date Visit',
  props<{ subGroupId: number, date: string }>()
);

export const deleteDateVisit = createAction(
  '[Labs] Delete Date Visit',
  props<{ id: number }>()
);
