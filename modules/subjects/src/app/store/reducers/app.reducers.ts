import {IAppState} from "../state/app.state";
import {subjectReducers} from "./subject.reducers";
import { ActionReducerMap } from '@ngrx/store';
import {newsReducers} from "./news.reducers";

export const appReducers: ActionReducerMap<IAppState, any> = {
  subject: subjectReducers,
  news: newsReducers
};
