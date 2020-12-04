import {createSelector} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {LabsState} from '../state/labs.state';

const labsSelector = (state: IAppState) => state.labs;

export const getLabs = createSelector(
  labsSelector,
  (state: LabsState) => state.labs
);

export const getLabsCalendar = createSelector(
  labsSelector,
  (state: LabsState) => state.schedule
);
