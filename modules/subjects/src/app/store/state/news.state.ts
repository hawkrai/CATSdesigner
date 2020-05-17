import {News} from "../../models/news.model";

export interface INewsState {
  newsList: News[];
}

export const initialNewsState: INewsState = {
  newsList: []
};
