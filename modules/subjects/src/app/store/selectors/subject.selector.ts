import { createSelector } from '@ngrx/store';
import {IAppState} from "../state/app.state";
import {ISubjectState} from "../state/subject.state";

export const getSubjectId = createSelector(
  (state: IAppState) => state.subject,
  (state: ISubjectState) => state.subject.id
);

export const getSubject = createSelector(
  (state: IAppState) => state.subject,
  (state: ISubjectState) => state.subject
);

export const getUser = createSelector(
  (state: IAppState) => state.subject,
  (state: ISubjectState) => state.user
);
