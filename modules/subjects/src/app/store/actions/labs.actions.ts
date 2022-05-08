import { createAction, props } from '@ngrx/store';
import { CreateLessonEntity } from 'src/app/models/form/create-lesson-entity.model';
import { StudentMark } from 'src/app/models/student-mark.model';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import {Lab } from '../../models/lab.model';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';
import { HasJobProtection } from 'src/app/models/job-protection/has-job-protection.model';
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model';
import { SubGroup } from 'src/app/models/sub-group.model';
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode';

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

export const loadLabsScheduleSuccess = createAction(
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
  props<{ obj: { subGroupId: number, date: string, startTime: string, endTime: string, building: string, audience: string, lecturerId: number } }>()
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

export const removeLabMark = createAction(
  '[Labs] Remove Lab Mark',
  props<{ id: number }>()
);

export const loadStudentsLabsFilesSuccess = createAction(
  '[Labs] Load Students Labs Files Success',
  props<{ studentsLabsFiles: StudentMark[] }>()
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
export const loadStudentLabFiles = createAction(
  '[Labs] Get Student Lab Files',
  props<{ userId?: number }>()
);

export const loadStudentLabFilesSuccess = createAction(
  '[Labs] Get Student Lab Files Success',
  props<{ labFiles: UserLabFile[], studentId: number }>()
);

export const sendUserFile = createAction(
  '[Labs] Send User File',
  props<{ sendFile: { attachments: string, id: number, pathFile: string, comments: string, userId: number, labId: number, isRet: boolean }, fileId: number }>()
);

export const sendUserFileSuccess = createAction(
  '[Labs] Send User File Success',
  props<{ userLabFile: UserLabFile, isReturned: boolean, fileId?: number }>()
);

export const deleteUserLabFile = createAction(
  '[Labs] Delete User Lab File',
  props<{ userLabFileId: number, userId: number }>()
);

export const deleteUserLabFileSuccess = createAction(
  '[Labs] Delete User Lab File Success',
  props<{ userId: number, userLabFileId: number }>()
);

export const loadGroupJobProtection = createAction(
  '[Labs] Load Group Job Protection'
);

export const loadGroupJobProtectionSuccess = createAction(
  '[Labs] Load Group Job Protection Success',
  props<{ groupJobProtection: GroupJobProtection }>()
);

export const resetStudentJobProtection = createAction(
  '[Labs] Reset Student Job Protection',
  props<{ studentId: number }>()
);

export const resetStudentsJobProtection = createAction(
  '[Labs] Reset Students Job Protection'
);

export const receiveLabFile = createAction(
  '[Labs] Receive Lab Files',
  props<{ userId: number, userFileId: number }>()
);

export const returnLabFile = createAction(
  '[Labs] Return Lab Files',
  props<{ userId: number, userFileId: number }>()
);

export const cancelLabFile = createAction(
  '[Labs] Cancel Lab File',
  props<{ userId: number, userFileId: number }>()
);

export const receiveLabFileSuccess = createAction(
  '[Labs] Receive Lab Files Success',
  props<{ userId: number, userFileId: number }>()
);

export const returnLabFileSuccess = createAction(
  '[Labs] Return Lab Files Success',
  props<{ userId: number, userFileId: number }>()
);

export const cancelLabFileSuccess = createAction(
  '[Labs] Cancel Lab File Success',
  props<{ userId: number, userFileId: number }>()
);


export const setLabsSubGroups = createAction(
  '[Labs] Set Labs SubGroups',
  props<{ subGroups: SubGroup[] }>()
);

export const loadLabsSubGroups = createAction(
  '[Labs] Load Labs SubGroups'
);

export const loadStudentJobProtection = createAction(
  '[Labs] Load Student Job Protection',
  props<{ studentId: number }>()

);

export const loadStudentJobProtectionSuccess = createAction(
  '[Labs] Load Student Job Protection Success',
  props<{ studentJobProtection: StudentJobProtection }>()
);