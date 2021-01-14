import { createReducer, on } from '@ngrx/store';
import { StudentMark } from 'src/app/models/student-mark.model';
import {initialLabsState, ILabsState} from '../state/labs.state';
import * as labsActions from '../actions/labs.actions';

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
  on(labsActions.loadStudentsLabsFilesSuccess, (state, { studentsLabsFiles }): ILabsState => ({
    ...state,
    studentsLabsFiles
  })),
  on(labsActions.loadUserLabsFilesSuccess, (state, { userLabsFiles }): ILabsState => ({
    ...state,
    userLabsFiles
  })),
  on(labsActions.updateUserLabsFilesSuccess, (state, { userLabsFiles, userId }): ILabsState => ({
    ...state,
    studentsLabsFiles: state.studentsLabsFiles.map((s): StudentMark => s.StudentId === userId ? { ...s, FileLabs: userLabsFiles } : s)
  })),
  on(labsActions.setJobProtections, (state, { hasJobProtections }): ILabsState => ({
    ...state,
    hasJobProtections
  }))
);