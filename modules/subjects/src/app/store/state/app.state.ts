import {initialSubjectState, ISubjectState} from "./subject.state";
import {INewsState, initialNewsState} from "./news.state";
import {GroupsState, initialGroupsState} from './groups.state';
import {initialLecturesState, LecturesState} from './lectures.state';
import {initialLabsState, LabsState} from './labs.state';


export interface IAppState {
  subject: ISubjectState;
  news: INewsState;
  groups: GroupsState;
  lectures: LecturesState;
  labs: LabsState
}

export const initialAppState: IAppState = {
  subject: initialSubjectState,
  news: initialNewsState,
  groups: initialGroupsState,
  lectures: initialLecturesState,
  labs: initialLabsState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
