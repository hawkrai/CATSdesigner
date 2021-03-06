import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { StudentMark } from 'src/app/models/student-mark.model';
import { Practical } from '../../models/practical.model';

export interface IPracticalsState {
  practicals: Practical[];
  schedule: ScheduleProtectionPractical[];
  students: StudentMark[];
}

export const initialPracticalsState: IPracticalsState = {
  practicals: [],
  schedule: [],
  students: []
}

