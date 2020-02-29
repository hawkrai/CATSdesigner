import {initialSubjectState, ISubjectState} from "./subject.state";
import {INewsState, initialNewsState} from "./news.state";


export interface IAppState {
  subject: ISubjectState;
  news: INewsState;
}

export const initialAppState: IAppState = {
  subject: initialSubjectState,
  news: initialNewsState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
