import { IAppState } from './../state/app.state';
import {createSelector} from '@ngrx/store';
import {INewsState} from '../state/news.state';

const getNewsState = (state: IAppState) => state.news;

export const getNews = createSelector(
  getNewsState,
  (state: INewsState) => state.news
);

export const getSelectedNews = createSelector(
  getNewsState,
  state => state.selectedNews
);