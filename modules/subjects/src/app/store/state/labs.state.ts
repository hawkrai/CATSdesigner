import { Lab, ScheduleProtectionLabs } from '../../models/lab.model';

export interface ILabsState {
  labs: Lab[];
  schedule: ScheduleProtectionLabs[];
}

export const initialLabsState: ILabsState = {
  labs: [],
  schedule: []
};
