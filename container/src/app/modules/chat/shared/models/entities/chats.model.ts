export class Chat {
  id?: number
  userId?: number
  name: string
  profilePicture?: string
  status?: string
  lastMessage?: string
  groupId: number
  time?: Date
  unread: number = 0
  isOnline?: boolean
  isTyping?: boolean
  isGroup?: boolean
}
