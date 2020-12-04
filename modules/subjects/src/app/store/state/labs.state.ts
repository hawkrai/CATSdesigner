import {Lab, ScheduleProtectionLab} from '../../models/lab.model';

export interface LabsState {
  labs: Lab[];
  schedule: ScheduleProtectionLab[];
}

export const initialLabsState: LabsState = {
  labs: [],
  schedule: []
};
