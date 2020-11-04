import { createAction } from '@ngrx/store';
import { props } from '@ngrx/store';
import {News} from '../../models/news.model';

export const loadNews = createAction(
  '[News] Load News',
);

export const loadNewsSuccess = createAction(
  '[News] Load News Success',
  props<{ news: News[] }>()
);

export const saveNews = createAction(
  '[News] Save News',
  props<{ news: News }>()
);

export const saveNewsSuccess = createAction(
  '[News] Save News Success'
);

export const deleteNewsById = createAction(
  '[News] Delete News By Id',
  props<{ id: string }>()
);

export const deleteNewsSuccess = createAction(
  '[News] Delete News Success'
);

export const disableAllNews = createAction(
  '[News] Disable All News'
);

export const enableAllNews = createAction(
  '[News] Enable All News'
);

export const setSelectedNews = createAction(
  '[News] Set Selected News',
  props<{ news: News }>()
);

export const resetNews = createAction(
  '[News] Reset News'
);