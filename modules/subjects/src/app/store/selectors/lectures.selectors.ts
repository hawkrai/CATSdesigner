import {createSelector} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {LecturesState} from '../state/lectures.state';


export const getLecturesCalendar = createSelector(
  (state: IAppState) => state.lectures,
  (state: LecturesState) => state.calendar
);
