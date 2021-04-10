import { createReducer, on } from '@ngrx/store';
import {initialLabsState, ILabsState} from '../state/labs.state';
import * as labsActions from '../actions/labs.actions';
import { JobProtection } from 'src/app/models/job-protection/job-protection.model';

export const labsReducer = createReducer(
  initialLabsState,
  on(labsActions.laodLabsScheduleSuccess, (state, action): ILabsState => ({
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
  on(labsActions.loadStudentJobProtectionSuccess, (state, { studentJobProtection }): ILabsState => ({
    ...state,
    studentJobProtection: {
      ...state.studentJobProtection,
      [studentJobProtection.StudentId]: studentJobProtection
    }
  })),
  on(labsActions.loadGroupJobProtectionSuccess, (state, { groupJobProtection }): ILabsState => ({
    ...state,
    groupJobProtection
  })),
  on(labsActions.setJobProtections, (state, { hasJobProtections }): ILabsState => ({
    ...state,
    hasJobProtections
  })),
  on(labsActions.loadStudentLabFilesSuccess, (state, { labFiles, studentId, labId }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [`${studentId} ${labId}`]: labFiles
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
  on(labsActions.receiveLabSuccess, (state, { studentId, labId }): ILabsState => ({
    ...state,
    studentJobProtection: {
      ...state.studentJobProtection,
      [studentId]: {
        ...state.studentJobProtection[studentId],
        JobProtections: state.studentJobProtection[studentId].JobProtections
          .map((jobProtection): JobProtection => jobProtection.LabId === labId ? { ...jobProtection, IsReceived: true, HasProtection: false } : jobProtection),
      }
    }
  })),
  on(labsActions.cancelLab, (state, { studentId, labId }): ILabsState => ({
    ...state,
    studentJobProtection: {
      ...state.studentJobProtection,
      [studentId]: {
        ...state.studentJobProtection[studentId],
        JobProtections: state.studentJobProtection[studentId].JobProtections
          .map((jobProtection): JobProtection => jobProtection.LabId === labId ? { ...jobProtection, IsReturned: false, IsReceived: false, HasProtection: true } : jobProtection),
      }
    }
  })),
  on(labsActions.returnLabSuccess, (state, { studentId, labId }): ILabsState => ({
    ...state,
    studentJobProtection: {
      ...state.studentJobProtection,
      [studentId]: {
        ...state.studentJobProtection[studentId],
        JobProtections: state.studentJobProtection[studentId].JobProtections
          .map((jobProtection): JobProtection => jobProtection.LabId === labId ? { ...jobProtection, IsReturned: true, HasProtection: false } : jobProtection),
      }
    }
  })),
  on(labsActions.sendUserFileSuccess, (state, { userLabFile }): ILabsState => ({
    ...state,
    studentsLabsFiles: {
      ...state.studentsLabsFiles,
      [`${userLabFile.UserId} ${userLabFile.LabId}`]: [...(state.studentsLabsFiles[`${userLabFile.UserId} ${userLabFile.LabId}`] || []), userLabFile]
    }
  }))
);