import { createReducer, on } from '@ngrx/store';
import { StudentMark } from 'src/app/models/student-mark.model';
import {initialLabsState, ILabsState} from '../state/labs.state';
import * as labsActions from '../actions/labs.actions';
import { Lab } from 'src/app/models/lab.model';

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
  on(labsActions.updateOrderSuccess, (state, { prevIndex, currentIndex }): ILabsState => ({
      ...state, 
      labs: state.labs.map((l, index): Lab => index === prevIndex ? { ...l, Order: currentIndex + 1 } : index === currentIndex ? { ...l, Order: prevIndex + 1 } : l)
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
  }))
);