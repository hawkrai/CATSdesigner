import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IAppState } from '../state/app.state';
import { getUserId } from './subject.selector';
import { IPracticalsState } from '../state/practicals.state';

const practicalsSelector = createFeatureSelector<IAppState, IPracticalsState>('practicals');

export const selectPracticals = createSelector(
  practicalsSelector,
  state => state.practicals
);

export const selectSchedule = createSelector(
  practicalsSelector,
  state => state.schedule
);

export const selectMarks = createSelector(
  practicalsSelector,
  state => state.students
);

export const hasJobProtections = createSelector(
  practicalsSelector,
  state => state.hasJobProtections
);

export const getStudentFiles = createSelector(
  practicalsSelector,
  getUserId,
  (state: IPracticalsState, userId: number, { studentId }: { studentId?: number }) => state.studentsPracticalsFiles ? state.studentsPracticalsFiles[studentId ? studentId : userId] : null
);

export const getGroupJobProtection = createSelector(
  practicalsSelector,
  
  state => state.groupJobProtection
);