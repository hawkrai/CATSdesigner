export class Chat {
  id?: number
  userId?: number
  name: string
  img?: string
  profilePicture?: string
  status?: string
  lastMessage?: string
  groupId?: number
  time?: Date
  unread: number = 0
  isOnline?: boolean
  isTyping?: boolean
  isGroup?: boolean
  isActiveOnCurrentGroup?: boolean
  isCompletedForUser?: boolean
}
