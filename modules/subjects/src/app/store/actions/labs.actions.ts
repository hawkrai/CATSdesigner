import { createAction, props } from '@ngrx/store';
import {Lab, ScheduleProtectionLab} from '../../models/lab.model';

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
  props<{ scheduleProtectionLabs: ScheduleProtectionLab[] }>()
);

export const createLab = createAction(
  '[Labs] Create Lab',
  props<{ lab: Lab }>()
);

export const deleteLab = createAction(
  '[Labs] Delete Lab',
  props<{ id: string }>()
);

export const updateLabsOrder = createAction(
  '[Labs] Update Labs Order',
  props<{ labs: Lab[] }>()
);

export const resetLabs = createAction(
  '[Labs] Reset Labs'
);