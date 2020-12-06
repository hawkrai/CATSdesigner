import { Practical } from './../../models/practical.model';
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
    })),
    on(practicalsActions.updateOrderSuccess, (state, { prevIndex, currentIndex }): IPracticalsState => ({
        ...state, 
        practicals: state.practicals.map((p, index): Practical => index === prevIndex ? { ...p, Order: currentIndex + 1 } : index === currentIndex ? { ...p, Order: prevIndex + 1 } : p)
    }))
);