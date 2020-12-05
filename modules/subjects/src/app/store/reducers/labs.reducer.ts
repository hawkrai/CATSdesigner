import { createReducer, on } from '@ngrx/store';
import {initialLabsState, ILabsState} from '../state/labs.state';
import * as labsActions from '../actions/labs.actions';
import { Lab } from 'src/app/models/lab.model';

export const labsReducer = createReducer(
  initialLabsState,
  on(labsActions.laodLabsScheduleSuccess, (state, action): ILabsState => ({
    ...state,
    schedule: action.scheduleProtectionLabs
  })),
  on(labsActions.loadLabsSuccess, (state, action): ILabsState => ({
    ...state,
    labs: action.labs
  })),
  on(labsActions.resetLabs, (state): ILabsState => ({
    ...state,
    labs: [],
    schedule: []
  })),
  on(labsActions.updateOrderSuccess, (state, { prevIndex, currentIndex }): ILabsState => ({
      ...state, 
      labs: state.labs.map((l, index): Lab => index === prevIndex ? { ...l, Order: currentIndex + 1 } : index === currentIndex ? { ...l, Order: prevIndex + 1 } : l)
  }))
);