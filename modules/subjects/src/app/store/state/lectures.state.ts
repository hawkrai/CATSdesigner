import { GroupsVisiting } from './../../models/visiting-mark/groups-visiting.model';
import { Lecture } from './../../models/lecture.model';
import {Calendar} from '../../models/calendar.model';

export interface ILecturesState {
  lectures: Lecture[];
  calendar: Calendar[];
  groupsVisiting: GroupsVisiting;
}

export const initialLecturesState: ILecturesState = {
  lectures: [],
  calendar: [],
  groupsVisiting: null
};
