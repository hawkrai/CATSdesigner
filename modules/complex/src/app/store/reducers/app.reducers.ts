import { IAppState } from '../states/app.state';
import { subjectReducers } from './subject.reducers';
import { filesReducer } from './files.reducers';
import { ActionReducerMap } from '@ngrx/store';

export const appReducers: ActionReducerMap<IAppState, any> = {
  subject: subjectReducers,
  files: filesReducer
};
