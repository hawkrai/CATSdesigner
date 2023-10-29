import { StudentMark } from 'src/app/models/student-mark.model'
import { Lab } from '../../models/lab.model'
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model'
import { HasJobProtection } from 'src/app/models/job-protection/has-job-protection.model'
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode'
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { SubGroup } from 'src/app/models/sub-group.model'

export interface ILabsState {
  labs: Lab[]
  schedule: ScheduleProtectionLab[]
  students: StudentMark[]
  hasJobProtections: HasJobProtection[]
  groupJobProtection: GroupJobProtection
  studentsLabsFiles: {
    [key: string]: UserLabFile[]
  }
  subGroups: SubGroup[]
}

export const initialLabsState: ILabsState = {
  labs: [],
  schedule: [],
  students: [],
  groupJobProtection: null,
  hasJobProtections: [],
  studentsLabsFiles: {},
  subGroups: [],
}
