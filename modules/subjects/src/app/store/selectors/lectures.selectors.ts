import {createFeatureSelector, createSelector} from '@ngrx/store';

import {IAppState} from '../state/app.state';
import { ILecturesState } from '../state/lectures.state';


const lecturesSelector = createFeatureSelector<IAppState, ILecturesState>('lectures');

export const getLectures = createSelector(
  lecturesSelector,
  state => state.lectures
);

export const getCalendar = createSelector(
  lecturesSelector,
  state => state.calendar
);

export const getGroupsVisiting = createSelector(
  lecturesSelector,
  state => state.groupsVisiting
);