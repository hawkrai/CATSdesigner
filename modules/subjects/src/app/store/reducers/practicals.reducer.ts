import { createReducer, on } from '@ngrx/store';

import { initialPracticalsState, IPracticalsState } from '../state/practicals.state';
import * as practicalsActions from '../actions/practicals.actions';

export const practicalsReducer = createReducer(
    initialPracticalsState,
    on(practicalsActions.loadPracticalsSuccess, (state, { practicals }): IPracticalsState => ({
        ...state,
        practicals
    })),
    on(practicalsActions.resetPracticals, (state): IPracticalsState => ({
        ...state,
        practicals: [],
        schedule: [],
        students: []
    })),
    on(practicalsActions.loadScheduleSuccess, (state, { schedule }): IPracticalsState => ({
        ...state,
        schedule
    })),
    on(practicalsActions.loadMarksSuccess, (state, { students }): IPracticalsState => ({
        ...state,
        students
    }))
);