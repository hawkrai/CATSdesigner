import { createReducer, on } from '@ngrx/store';

import { initialPracticalsState, IPracticalState } from '../state/practicals.state';
import * as practicalsActions from '../actions/practicals.actions';

export const practicalsReducer = createReducer(
    initialPracticalsState,
    on(practicalsActions.loadPracticalsSuccess, (state, action): IPracticalState => ({
        ...state,
        practicals: action.practicals
    })),
    on(practicalsActions.resetPracticals, (state): IPracticalState => ({
        ...state,
        practicals: []
    }))
);