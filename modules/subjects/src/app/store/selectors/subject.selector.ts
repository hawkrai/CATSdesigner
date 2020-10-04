import { createSelector } from '@ngrx/store';
import {IAppState} from "../state/app.state";
import {ISubjectState} from "../state/subject.state";

export const subjectSelector = createSelector(
  (state: IAppState) => state.subject,
  subject => subject
);

export const getSubjectId = createSelector(
  subjectSelector,
  (state: ISubjectState) => state.subject ? state.subject.SubjectId : -1
);

export const getSubject = createSelector(
  subjectSelector,
  (state: ISubjectState) => state.subject
);

export const getUser = createSelector(
  subjectSelector,
  (state: ISubjectState) => state.user
);

export const getSubjects = createSelector(
  subjectSelector,
  state => state.subjects
);
