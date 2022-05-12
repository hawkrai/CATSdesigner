import { createReducer, on } from '@ngrx/store';
import {initialLabsState, ILabsState} from '../state/labs.state';
import * as labsActions from '../actions/labs.actions';
import * as userFilesUtils from '../../utils/user-files.utils';
import { JobProtection } from 'src/app/models/job-protection/job-protection.model';
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode';
import { UserLabFile } from 'src/app/models/user-lab-file.model';

export const labsReducer = createReducer(
  initialLabsState,
  on(labsActions.loadLabsScheduleSuccess, (state, action): ILabsState => ({
    ...state,
    schedule: action.scheduleProtectionLabs
  })),
  on(labsActions.setLabStudents, (state, { students }): ILabsState => ({
    ...state, 
    students
  })),
  on(labsActions.loadLabsSuccess, (state, action): ILabsState => ({
    ...state,
    labs: action.labs
  })),
  on(labsActions.resetLabs, (state): ILabsState => ({
    ...state,
    labs: [],
    schedule: [],
    students: [],
    subGroups: []
  })),
  on(labsActions.setLabsSubGroups, (state, { subGroups }): ILabsState => ({
    ...state,
    subGroups
  })),
  on(labsActions.loadGroupJobProtectionSuccess, (state, { groupJobProtection }): ILabsState => ({
    ...state,
    groupJobProtection
  })),
  on(labsActions.loadStudentJobProtectionSuccess, (state, { studentJobProtection }): ILabsState => ({
    ...state,
    groupJobProtection: { ...state.groupJobProtection, StudentsJobProtections: state.groupJobProtection.StudentsJobProtections.map(x => x.StudentId === studentJobProtection.StudentId ? studentJobProtection : x )}
  })),
  on(labsActions.setJobProtections, (state, { hasJobProtections }): ILabsState => ({
    ...state,
    hasJobProtections
  })),
  on(labsActions.loadStudentLabFilesSuccess, (state, { labFiles, studentId }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [studentId]: labFiles
    }
  })),
  on(labsActions.receiveLabFileSuccess, (state, { userId, userFileId }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [userId]: (state.studentsLabsFiles[userId] || []).map((ulf): UserLabFile => ulf.Id === userFileId ? { ...ulf, IsReceived: true }:  ulf)
    }
  })),
  on(labsActions.cancelLabFileSuccess, (state, { userId, userFileId }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [userId]: (state.studentsLabsFiles[userId] || []).map((ulf): UserLabFile => ulf.Id === userFileId ? { ...ulf, IsReceived: false, IsReturned: false }:  ulf)
    }
  })),
  on(labsActions.returnLabFileSuccess, (state, { userId, userFileId }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [userId]: (state.studentsLabsFiles[userId] || []).map((ulf): UserLabFile => ulf.Id === userFileId ? { ...ulf, IsReturned: true }:  ulf)
    }
  })),
  on(labsActions.sendUserFileSuccess, (state, { userLabFile }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [userLabFile.UserId]: userFilesUtils.sendUserFileSuccess(state.studentsLabsFiles[userLabFile.UserId] || [], userLabFile)
    }
  })),
  on(labsActions.deleteUserLabFileSuccess, (state, { userId, userLabFileId }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [userId]: (state.studentsLabsFiles[userId] || []).filter(x => x.Id !== userLabFileId)
    }
  }))
);