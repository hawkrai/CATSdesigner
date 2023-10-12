export class Chat {
  id?: number
  userId?: number
  name: string
  profilePicture?: string
  status?: string
  lastMessage?: string
  groupId: number
  time: string
  unread: number = 0
  isOnline?: boolean
  isTyping?: boolean
  isGroup?: boolean
}
