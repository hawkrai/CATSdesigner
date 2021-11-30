import { createAction, props } from '@ngrx/store';
import {Group} from '../../models/group.model';

export const loadGroups = createAction(
  '[Groups] Load Groups',
  props<{ groupId: number }>()
);

export const loadGroupsSuccess = createAction(
  '[Groups] Load Groups Success',
  props<{ groups: Group[], groupId: number }>()
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
  '[Groups] Load Old Groups',
  props<{ groupId: number }>()
);

export const loadActiveGroups = createAction(
  '[Groups] Load Active Groups',
  props<{ groupId: number }>()
);

export const loadStudentGroup = createAction(
  '[Groups] Load Student Group'
);

export const triggerGroupActiveState = createAction(
  '[Groups] Trigger Group Active State',
);

export const setActiveState = createAction(
  '[Groups] Set Group Active State',
  props<{ isActive: boolean }>()
);