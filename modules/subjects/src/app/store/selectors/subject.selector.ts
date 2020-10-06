import { createSelector } from '@ngrx/store';
import {IAppState} from "../state/app.state";
import {ISubjectState} from "../state/subject.state";

export const subjectSelector = createSelector(
  (state: IAppState) => state.subject,
  subject => subject
);

export const getSubjectId = createSelector(
  subjectSelector,
  (state: ISubjectState) => state.subjectId
);

export const getSubjects = createSelector(
  subjectSelector,
  state => state.subjects
);

export const getUser = createSelector(
  subjectSelector,
  (state: ISubjectState) => state.user
);

export const isUserLector = createSelector(
  subjectSelector,
  state => state.user.role.toLowerCase() === 'lector'
);
