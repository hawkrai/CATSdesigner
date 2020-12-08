import { IFilesState } from './files.state';
import { ISubjectState } from "./subject.state";
import { INewsState } from "./news.state";
import { IGroupsState } from './groups.state';
import { ILecturesState } from './lectures.state';
import { ILabsState } from './labs.state';
import { IPracticalsState } from './practicals.state';


export interface IAppState {
  subject: ISubjectState;
  news: INewsState;
  groups: IGroupsState;
  lectures: ILecturesState;
  labs: ILabsState,
  practicals: IPracticalsState,
  files: IFilesState
};

