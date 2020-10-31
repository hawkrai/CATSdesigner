import { createReducer, on } from '@ngrx/store';
import {initialLabsState, LabsState} from '../state/labs.state';
import * as labsActions from '../actions/labs.actions';

export const labsReducers = createReducer(
  initialLabsState,
  on(labsActions.laodLabsScheduleSuccess, (state, action): LabsState => ({
    ...state,
    schedule: action.scheduleProtectionLabs
  })),
  on(labsActions.loadLabsSuccess, (state, action): LabsState => ({
    ...state,
    labs: action.labs
  }))
);