import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IAppState } from '../state/app.state';
import { IPracticalsState } from '../state/practicals.state';

const practicalsSelector = createFeatureSelector<IAppState, IPracticalsState>('practicals');

export const getPracticals = createSelector(
  practicalsSelector,
  state => state.practicals
);