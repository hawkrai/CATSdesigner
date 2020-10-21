import { createSelector } from '@ngrx/store';
import {IAppState} from "../state/app.state";
import {ISubjectState} from "../state/subject.state";

export const getSubject = createSelector(
  (state: IAppState) => state.subject,
  (state: ISubjectState) => state.subject
);

export const getSubjectId = createSelector(
  getSubject,
  subject => subject.id
);

export const getUser = createSelector(
  (state: IAppState) => state.subject,
  (state: ISubjectState) => state.user
);

export const isTeacher = createSelector(
  getUser,
  user => user && user.role.toLowerCase() === 'lector'
);