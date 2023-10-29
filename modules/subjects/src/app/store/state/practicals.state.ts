import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model'
import { HasJobProtection } from 'src/app/models/job-protection/has-job-protection.model'
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model'
import { StudentMark } from 'src/app/models/student-mark.model'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { Practical } from '../../models/practical.model'

export interface IPracticalsState {
  practicals: Practical[]
  schedule: ScheduleProtectionPractical[]
  students: StudentMark[]
  hasJobProtections: HasJobProtection[]
  groupJobProtection: GroupJobProtection
  studentsPracticalsFiles: {
    [key: string]: UserLabFile[]
  }
}

export const initialPracticalsState: IPracticalsState = {
  practicals: [],
  schedule: [],
  students: [],
  groupJobProtection: null,
  hasJobProtections: [],
  studentsPracticalsFiles: {},
}
