import { Lecture } from './../../models/lecture.model';
import { createReducer, on } from '@ngrx/store';

import {initialLecturesState, ILecturesState} from '../state/lectures.state';
import * as lecturesActions from '../actions/lectures.actions';

export const lecturesReducer = createReducer(
  initialLecturesState,
  on(lecturesActions.loadLecturesSuccess, (state, { lectures }): ILecturesState => ({
    ...state, 
    lectures
  })),
  on(lecturesActions.loadCalendarSuccess, (state, { calendar }): ILecturesState => ({
    ...state, 
    calendar
  })),
  on(lecturesActions.loadGroupsVisitingSuccess, (state, { groupsVisiting }): ILecturesState => ({
    ...state, 
    groupsVisiting
  })),
  on(lecturesActions.resetLectures, (state): ILecturesState => ({
    ...state,
    lectures: []
  })),
  on(lecturesActions.resetVisiting, (state): ILecturesState => ({
    ...state,
    calendar: [],
    groupsVisiting: null
  }))
);