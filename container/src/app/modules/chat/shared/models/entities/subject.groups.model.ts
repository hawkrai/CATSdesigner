import { Groups } from './groups.model'
import { Chat } from './chats.model'
export class SubjectGroups {
  id: number
  name: string
  shortName: string
  color: string
  unread: number = 0
  groups?: Chat[]
}
