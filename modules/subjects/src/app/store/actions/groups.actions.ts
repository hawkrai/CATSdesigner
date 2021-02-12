import { createAction, props } from '@ngrx/store';
import {Group} from '../../models/group.model';

export const loadGroups = createAction(
  '[Groups] Load Groups'
);

export const loadGroupsSuccess = createAction(
  '[Groups] Load Groups Success',
  props<{ groups: Group[] }>()
);

export const setCurrentGroup = createAction(
  '[Groups] Set Current Group',
  props<{ group: Group }>()
);

export const setCurrentGroupById = createAction(
  '[Groups] Set Curret Group By Id',
  props<{ id: number }>()
);

export const loadOldGroups = createAction(
  '[Groups] Load Old Groups'
);

export const resetGroups = createAction(
  '[Groups] Reset Groups'
);

export const loadStudentGroup = createAction(
  '[Groups] Load Student Group'
);