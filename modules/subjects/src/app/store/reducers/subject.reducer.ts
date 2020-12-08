import {createReducer, on} from '@ngrx/store';
import {initialSubjectState, ISubjectState} from "../state/subject.state";
import * as subjectActions from '../actions/subject.actions';

export const subjectReducer = createReducer(
  initialSubjectState,
  on(subjectActions.setSubject, (state, action): ISubjectState => ({
    ...state,
    selectedSubject: action.subject
  })),
  on(subjectActions.setUser, (state, { user }): ISubjectState => ({
    ...state,
    user
  })),
  on(subjectActions.loadSubjectsSuccess, (state, { subjects }): ISubjectState => ({
    ...state,
    subjects
  })),
  on(subjectActions.resetSubjects, (state): ISubjectState => ({
    ...state,
    subjects: []
  }))
);
