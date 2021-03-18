import { HasJobProtection } from './../../models/has-job-protection.model';
import { createAction, props } from '@ngrx/store';
import { CreateLessonEntity } from 'src/app/models/form/create-lesson-entity.model';
import { StudentMark } from 'src/app/models/student-mark.model';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import {Lab } from '../../models/lab.model';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';

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
  '[Labs] Update Labs Order',
  props<{ prevIndex: number, currentIndex: number }>()
);

export const createDateVisit = createAction(
  '[Labs] Create Date Visit',
  props<{ obj: { subGroupId: number, date: string, startTime: string, endTime: string, building: string, audience: string } }>()
);

export const deleteDateVisit = createAction(
  '[Labs] Delete Date Visit',
  props<{ id: number }>()
);

export const loadLabStudents = createAction(
  '[Labs] Load Lab Students'
);

export const setLabStudents = createAction(
  '[Labs] Set Lab Students',
  props<{ students: StudentMark[] }>()
);

export const setLabMark = createAction(
  '[Labs] Set Lab Mark',
  props<{ labMark: { studentId: number, labId: number, mark: string, comment: string, date: string, id: number, showForStudent: boolean } }>()
);

export const loadStudentsLabsFiles = createAction(
  '[Labs] Load Students Labs Files'
);

export const loadStudentsLabsFilesSuccess = createAction(
  '[Labs] Load Students Labs Files Success',
  props<{ studentsLabsFiles: StudentMark[] }>()
);

export const refreshJobProtection = createAction(
  '[Labs] Refresh Job Protection'
);

export const getMarksExcel = createAction(
  '[Labs] Get Marks Excel'
);

export const getVisitingExcel = createAction(
  '[Labs] Get Visiting Excel'
);

export const getLabsAsZip = createAction(
  '[Labs] Get Labs As Zip'
);

export const setLabsVisitingDate = createAction(
  '[Labs] Set Labs Visiting Date',
  props<{ visiting: { Id: number[], comments: string[], showForStudents: boolean[], dateId: number, marks: string[], students: StudentMark[] } }>()
);

export const checkJobProtections = createAction(
  '[Labs] Check Job Protection'
);

export const setJobProtections = createAction(
  '[Labs] Set Job Protections',
  props<{ hasJobProtections: HasJobProtection[] }>()
);
export const loadUserLabFiles = createAction(
  '[Labs] Get User Lab Files',
  props<{ userId: number, labId: number }>()
);

export const loadUserLabFilesSuccess = createAction(
  '[Labs] Get User Lab Files Success',
  props<{ labFiles: UserLabFile[] }>()
);

export const resetUserLabFiles = createAction(
  '[Labs] Reset User Lab Files'
);

export const sendUserFile = createAction(
  '[Labs] Send User File',
  props<{ sendFile: { attachments: string, id: number, isRet: boolean, pathFile: string, comments: string, userId: number, labId: number } }>()
);

export const receiveLabFile = createAction(
  '[Labs] Receive Lab File',
  props<{ userFileId: number }>()
);

export const cancelLabFile = createAction(
  '[Labs] Cancel Lab File',
  props<{ userFileId: number }>()
);

export const deleteUserLabFile = createAction(
  '[Labs] Delete User Lab File',
  props<{ userLabFileId: number, userId: number, labId: number }>()
);