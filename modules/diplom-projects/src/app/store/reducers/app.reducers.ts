import {IAppState} from '../state/app.state';
import {subjectReducers} from './subject.reducers';
import { ActionReducerMap } from '@ngrx/store';

export const appReducers: ActionReducerMap<IAppState, any> = {
  subject: subjectReducers
};
