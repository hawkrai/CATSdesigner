import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IAppState } from '../state/app.state';
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