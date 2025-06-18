import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { IOfferEvent } from '@modules/video-chat/interfaces/offer-event.interface'
import { IAnswerEvent } from '@modules/video-chat/interfaces/answer-event.interface'
import { ICandidateEvent } from '@modules/video-chat/interfaces/candidate-event.interface'

@Injectable({
  providedIn: 'root',
})
export abstract class WebRtcSignalingGateway {
  abstract selfConnectionId: string | null

  abstract onNewParticipant$: Observable<string>
  abstract onExistingParticipants$: Observable<string[]>
  abstract onParticipantLeft$: Observable<string>
  abstract onOffer$: Observable<IOfferEvent>
  abstract onAnswer$: Observable<IAnswerEvent>
  abstract onCandidate$: Observable<ICandidateEvent>

  abstract leaveGroupCall(groupChatId: number): Promise<void>
  abstract sendOffer(targetConnectionId: string, offer: any): Promise<void>
  abstract sendAnswer(targetConnectionId: string, answer: any): Promise<void>
  abstract sendCandidate(
    targetConnectionId: string,
    candidate: any
  ): Promise<void>

  abstract sendCallRequest(chatId: number): Promise<void>
  abstract disconnectFromCall(chatId: number): Promise<void>
  abstract setVoiceChatConnection(chatId: number): Promise<void>
  abstract sendRejection(chatId: number, message: string): Promise<void>
}
