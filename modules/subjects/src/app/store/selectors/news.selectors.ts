import { createFeatureSelector, createSelector } from '@ngrx/store'
import { INewsState } from '../state/news.state'
import { IAppState } from './../state/app.state'

const newsSelector = createFeatureSelector<IAppState, INewsState>('news')

export const getNews = createSelector(newsSelector, (state) => state.news)

export const getSelectedNews = createSelector(
  newsSelector,
  (state) => state.selectedNews
)
