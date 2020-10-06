import {createReducer, on} from '@ngrx/store';
import {initialSubjectState, ISubjectState} from "../state/subject.state";
import * as subjectActions from '../actions/subject.actions';

export const subjectReducers = createReducer(
  initialSubjectState,
  on(subjectActions.setSubjectId, (state, action): ISubjectState => ({
    ...state,
    subjectId: action.id
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
