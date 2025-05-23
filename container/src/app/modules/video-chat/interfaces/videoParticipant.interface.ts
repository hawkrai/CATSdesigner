export interface IVideoParticipant {
  displayName: string
  avatarUrl?: string
  initials?: string
  isCurrentUser: boolean
  cameraOn: boolean
  micOn: boolean
  stream?: MediaStream
}
