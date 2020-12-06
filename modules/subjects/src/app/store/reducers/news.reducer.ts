import { INewsState, initialNewsState } from '../state/news.state';
import { createReducer, on } from '@ngrx/store';
import * as newsActinos from '../actions/news.actions';

export const newsReducer = createReducer(
  initialNewsState,
  on(newsActinos.loadNewsSuccess, (state, action): INewsState => ({
    ...state,
    news: action.news
  })),
  on(newsActinos.setSelectedNews, (state, action): INewsState => ({
    ...state,
    selectedNews: action.news
  })),
  on(newsActinos.resetNews, (state): INewsState => ({
    ...state,
    news: [],
    selectedNews: null
  }))
);
