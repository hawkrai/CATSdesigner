import { UserLabFile } from '../user-lab-file.model'

export class JobProtection {
  LabId?: number
  StudentId: number
  IsReturned: boolean
  IsReceived: boolean
  LabName: string
  HasProtection: boolean
}
