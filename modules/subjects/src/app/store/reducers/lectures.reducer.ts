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
    lectures: [],
    calendar: []
  })),
  on(lecturesActions.updateOrderSuccess, (state, { prevIndex, currentIndex }): ILecturesState => ({
    ...state, 
    lectures: state.lectures.map((l, index): Lecture => index === prevIndex ? { ...l, Order: currentIndex + 1 } : index === currentIndex ? { ...l, Order: prevIndex + 1 } : l)
  }))
);