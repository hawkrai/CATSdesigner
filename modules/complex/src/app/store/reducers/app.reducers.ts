import { IAppState } from '../states/app.state';
import { subjectReducers } from './subject.reducers';
import { ActionReducerMap } from '@ngrx/store';

export const appReducers: ActionReducerMap<IAppState> = {
  subject: subjectReducers  
};
