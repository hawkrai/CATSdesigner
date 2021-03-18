import { HasJobProtection } from './../../models/has-job-protection.model';
import { StudentMark } from 'src/app/models/student-mark.model';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { Lab } from '../../models/lab.model';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';

export interface ILabsState {
  labs: Lab[];
  schedule: ScheduleProtectionLab[];
  students: StudentMark[];
  studentsLabsFiles: StudentMark[],
  hasJobProtections: HasJobProtection[],
  userLabFiles: UserLabFile[]
}

export const initialLabsState: ILabsState = {
  labs: [],
  schedule: [],
  students: [],
  studentsLabsFiles: [],
  userLabFiles: [],
  hasJobProtections: []
};
