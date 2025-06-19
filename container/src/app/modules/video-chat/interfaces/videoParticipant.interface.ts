export interface IVideoParticipant {
  userId?: number
  displayName: string
  avatarUrl?: string
  initials?: string
  isCurrentUser: boolean
  cameraOn: boolean
  micOn: boolean
  stream?: MediaStream
}
