import { Chat } from '@chat/shared/models/entities/chats.model'
export class SubjectGroups {
  id: number
  name: string
  shortName: string
  color: string
  unread: number = 0
  groups?: Chat[]
}
