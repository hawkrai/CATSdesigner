import {initialSubjectState, ISubjectState} from "./subject.state";
import {INewsState, initialNewsState} from "./news.state";
import {GroupsState, initialGroupsState} from './groups.state';


export interface IAppState {
  subject: ISubjectState;
  news: INewsState;
  groups: GroupsState;
}

export const initialAppState: IAppState = {
  subject: initialSubjectState,
  news: initialNewsState,
  groups: initialGroupsState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
