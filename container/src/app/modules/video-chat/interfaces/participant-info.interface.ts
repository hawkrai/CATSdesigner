import { IParticipantState } from './participant-state.interface'

export interface IParticipantInfo {
  [connectionId: string]: IParticipantState
}
