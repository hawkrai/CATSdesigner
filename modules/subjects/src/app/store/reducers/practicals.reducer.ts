import { createReducer, on } from '@ngrx/store';

import { initialPracticalsState, IPracticalsState } from '../state/practicals.state';
import * as practicalsActions from '../actions/practicals.actions';

export const practicalsReducer = createReducer(
    initialPracticalsState,
    on(practicalsActions.loadPracticalsSuccess, (state, action): IPracticalsState => ({
        ...state,
        practicals: action.practicals
    })),
    on(practicalsActions.resetPracticals, (state): IPracticalsState => ({
        ...state,
        practicals: []
    }))
);