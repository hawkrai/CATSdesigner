import { createFeatureSelector, createSelector } from '@ngrx/store';
import {IAppState} from "../state/app.state";
import {ISubjectState} from "../state/subject.state";

const subjectSelector = createFeatureSelector<IAppState, ISubjectState>('subject');

export const getSelectedSubject = createSelector(
  subjectSelector,
  state => state.selectedSubject
);

export const getSubjectId = createSelector(
  getSelectedSubject,
  subject => !!subject ? subject.id : -1
);

export const getSubjectColor = createSelector(
  getSelectedSubject,
  subject => !!subject ? subject.color : ''
);

export const getUser = createSelector(
  subjectSelector,
  state => state.user
);

export const getUserId = createSelector(
  getUser,
  user => user ? +user.id : null
);

export const isTeacher = createSelector(
  getUser,
  user => user && user.role.toLowerCase() === 'lector'
);

export const getSubjects = createSelector(
  subjectSelector,
  state => state.subjects
);