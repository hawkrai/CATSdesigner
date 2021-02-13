import { ILabsState } from './../state/labs.state';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {IAppState} from '../state/app.state';

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

export const getStudentsLabsFiles = createSelector(
  labsSelector,
  state => state.studentsLabsFiles
);

export const HasJobProtections = createSelector(
  labsSelector,
  state => state.hasJobProtections
);

export const selectUserLabFiles = createSelector(
  labsSelector,
  state => state.userLabFiles
);