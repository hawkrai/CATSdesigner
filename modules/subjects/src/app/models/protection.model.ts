import { ProtectionType } from './protection-type.enum'

export class Protection {
  subjectId: number
  userId: number
  groupId: number
  protectionType: ProtectionType
  from: number
}
