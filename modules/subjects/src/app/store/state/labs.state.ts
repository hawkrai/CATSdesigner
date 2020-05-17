import {Lab, ScheduleProtectionLab} from '../../models/lab.model';

export interface LabsState {
  labs: Lab[];
  calendar: ScheduleProtectionLab[];
}

export const initialLabsState: LabsState = {
  labs: [],
  calendar: []
};
