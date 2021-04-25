import { ILabsState } from './../state/labs.state';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import { getUserId } from './subject.selector';
const labsSelector = createFeatureSelector<IAppState, ILabsState>('labs');


export const getLabs = createSelector(
  labsSelector,
  state => state.labs
);

export const getLabsCalendar = createSelector(
  labsSelector,
  state => state.schedule
);

export const getLabStudents = createSelector(
  labsSelector,
  state => state.students
);

export const hasJobProtections = createSelector(
  labsSelector,
  state => state.hasJobProtections
);

export const getStudentLabFiles = createSelector(
  labsSelector,
  getUserId,
  (state: ILabsState, userId: number, { studentId }: { studentId?: number }) => state.studentsLabsFiles ? state.studentsLabsFiles[studentId ? studentId : userId] : null
);

export const getGroupJobProtection = createSelector(
  labsSelector,
  
  state => state.groupJobProtection
);