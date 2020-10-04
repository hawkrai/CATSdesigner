import {createReducer, on} from '@ngrx/store';
import {initialSubjectState, ISubjectState} from "../state/subject.state";
import * as subjectActions from '../actions/subject.actions';

export const subjectReducers = createReducer(
  initialSubjectState,
  on(subjectActions.setSubject, (state, action): ISubjectState => ({
    ...state,
    subject: action.subject
  })),
  on(subjectActions.setUser, (state, action): ISubjectState => ({
    ...state,
    user: action.user
  })),
  on(subjectActions.loadSubjectsSuccess, (state, action): ISubjectState => ({
    ...state,
    subjects: action.subjects
  }))
);
