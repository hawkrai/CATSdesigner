import { createReducer, on } from '@ngrx/store';
import {initialLabsState, ILabsState} from '../state/labs.state';
import * as labsActions from '../actions/labs.actions';
import * as labsUtils from '../../utils/labs.utils';
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
    students: []
  })),
  on(labsActions.loadGroupJobProtectionSuccess, (state, { groupJobProtection }): ILabsState => ({
    ...state,
    groupJobProtection
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
  on(labsActions.resetStudentsLabFiles, (state): ILabsState => ({
    ...state,
    studentsLabsFiles: {}
  })),
  on(labsActions.resetStudentLabFiles, (state, { studentId }): ILabsState => ({
    ...state,
    studentsLabsFiles: Object.keys(state.studentsLabsFiles)
    .filter(k => +k === studentId).reduce((acc, key) => ({ ...acc, [key]: state.studentsLabsFiles[key] }), {})
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
      [userLabFile.UserId]: labsUtils.sendUserLabFileSuccess(state.studentsLabsFiles[userLabFile.UserId] || [], userLabFile)
    }
  })),
  on(labsActions.deleteUserLabFileSuccess, (state, { userId, labId }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [userId]: (state.studentsLabsFiles[userId] || []).filter(x => x.LabId !== labId)
    }
  })),
  on(labsActions.updateJobProtection, (state, { userId }): ILabsState => ({
    ...state,
    groupJobProtection: {
      ...state.groupJobProtection,
      StudentsJobProtections: state
      .groupJobProtection
      .StudentsJobProtections.map((s): StudentJobProtection => s.StudentId === userId ? { 
        ...s, 
        HasProtection: state.studentsLabsFiles[userId].some(x => !x.IsReceived && !x.IsReturned)
      } : s)
    }
  }))
);