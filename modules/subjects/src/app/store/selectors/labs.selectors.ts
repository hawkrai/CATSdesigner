import {createSelector} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {LabsState} from '../state/labs.state';

export const getLabs = createSelector(
  (state: IAppState) => state.labs,
  (state: LabsState) => state.labs
);

export const getLabsCalendar = createSelector(
  (state: IAppState) => state.labs,
  (state: LabsState) => state.calendar
);
