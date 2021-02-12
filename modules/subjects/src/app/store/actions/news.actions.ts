import { createAction } from '@ngrx/store';
import { props } from '@ngrx/store';

import {News} from '../../models/news.model';
import { CreateNewsEntity } from './../../models/form/create-news-entity.model';

export const loadNews = createAction(
  '[News] Load News',
);

export const loadNewsSuccess = createAction(
  '[News] Load News Success',
  props<{ news: News[] }>()
);

export const saveNews = createAction(
  '[News] Save News',
  props<{ news: CreateNewsEntity }>()
);


export const deleteNewsById = createAction(
  '[News] Delete News By Id',
  props<{ id: number }>()
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