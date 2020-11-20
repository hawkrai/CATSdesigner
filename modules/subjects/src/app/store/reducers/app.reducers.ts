import {IAppState} from '../state/app.state';
import {subjectReducers} from './subject.reducers';
import {ActionReducerMap} from '@ngrx/store';
import {newsReducers} from './news.reducers';
import {groupsReducers} from './groups.reducers';
import {lecturesReducers} from './lectures.reducers';
import {labsReducers} from './labs.reducers';
import { practicalsReducer } from './practicals.reducer';

export const appReducers: ActionReducerMap<IAppState, any> = {
  subject: subjectReducers,
  news: newsReducers,
  groups: groupsReducers,
  lectures: lecturesReducers,
  labs: labsReducers,
  practicals: practicalsReducer
};
