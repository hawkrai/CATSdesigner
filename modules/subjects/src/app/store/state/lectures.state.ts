import {Calendar} from '../../models/calendar.model';

export interface LecturesState {
  calendar: Calendar[];
}

export const initialLecturesState: LecturesState = {
  calendar: []
};
