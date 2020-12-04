import { ISubjectState } from "./subject.state";
import { INewsState } from "./news.state";
import { GroupsState } from './groups.state';
import { LecturesState } from './lectures.state';
import { LabsState } from './labs.state';
import { IPracticalState } from './practicals.state';


export interface IAppState {
  subject: ISubjectState;
  news: INewsState;
  groups: GroupsState;
  lectures: LecturesState;
  labs: LabsState,
  practicals: IPracticalState
};

