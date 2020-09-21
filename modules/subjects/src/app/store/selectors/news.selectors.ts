import {createSelector} from '@ngrx/store';
import {IAppState} from "../state/app.state";
import {INewsState} from "../state/news.state";

export const getNews = createSelector(
  (state: IAppState) => state.news,
  (state: INewsState) => state.newsList
);
