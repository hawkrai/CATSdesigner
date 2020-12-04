import { createSelector } from "@ngrx/store";
import { IAppState } from '../state/app.state';

const practicalsState = (state: IAppState) => state.practicals;

export const getPracticals = createSelector(
  practicalsState,
  state => state.practicals
);