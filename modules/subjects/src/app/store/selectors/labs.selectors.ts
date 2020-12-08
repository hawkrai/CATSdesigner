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
