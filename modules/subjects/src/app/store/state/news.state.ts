import { News } from '../../models/news.model'

export interface INewsState {
  news: News[]
  selectedNews: News
}

export const initialNewsState: INewsState = {
  news: [],
  selectedNews: null,
}
