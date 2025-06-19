import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { ChatService } from '@chat/shared/services/chatService'
import { DataService } from '@chat/shared/services/dataService'
import { Chat } from '@chat/shared/models/entities/chats.model'
import { User } from '@chat/shared/models/dto/user'
import { IVideoParticipant } from '@modules/video-chat/interfaces/videoParticipant.interface'
import { TranslatePipe } from 'educats-translate'
import { WebRtcSignalingGateway } from './webrtc-signaling.gateway'

@Injectable({
  providedIn: 'root',
})
export class VideoChatService {
  public currentChatId: number | null = null
  public isActiveCall = new BehaviorSubject<boolean>(false)
  public isIncomingCall = new BehaviorSubject<boolean>(false)
  public isOutgoingCall = new BehaviorSubject<boolean>(false)
  public remoteParticipantInfo = new BehaviorSubject<IVideoParticipant | null>(
    null
  )
  public localParticipantInfo = new BehaviorSubject<IVideoParticipant | null>(
    null
  )
  public activeGroupCallId = new BehaviorSubject<number | null>(null)
  public groupCallParticipants = new BehaviorSubject<
    Map<string, IVideoParticipant>
  >(new Map())

  private _currentRemoteChatInfo: Chat | null = null
  constructor(
    private chatService: ChatService,
    private dataService: DataService,
    private translatePipe: TranslatePipe,
    private signalingGateway: WebRtcSignalingGateway
  ) {
    const baseCurrentUser = this.dataService.user
    if (baseCurrentUser && baseCurrentUser.id) {
      this.chatService.loadCurrentUserInfo().subscribe(
        (fullUserInfo: User | null) => {
          if (fullUserInfo && fullUserInfo.fullName) {
            this.localParticipantInfo.next({
              displayName: this.formatLocalUserName(fullUserInfo.fullName),
              avatarUrl: fullUserInfo.profile,
              isCurrentUser: true,
              cameraOn: false,
              micOn: true,
              initials: this.getInitials(fullUserInfo.fullName),
            })
          } else {
            this.setDefaultLocalParticipantInfo(baseCurrentUser)
          }
        },
        (error) => {
          this.setDefaultLocalParticipantInfo(baseCurrentUser)
        }
      )
    }

    this.localParticipantInfo.subscribe((self) => {
      if (self && this.activeGroupCallId.getValue() !== null) {
        const selfId = this.signalingGateway.selfConnectionId
        if (selfId) {
          const currentParticipants = this.groupCallParticipants.getValue()
          currentParticipants.set(selfId, self)
          this.groupCallParticipants.next(new Map(currentParticipants))
        }
      }
    })
  }

  private formatLocalUserName(fullName: string): string {
    if (!fullName)
      return this.translatePipe.transform(
        'videochat.defaultLocalUserName',
        'Пользователь'
      )
    const parts = fullName.split(' ')
    return parts.length > 1 ? parts[1] : parts[0]
  }

  private formatRemoteUserName(fullName: string): string {
    if (!fullName)
      return this.translatePipe.transform(
        'videochat.defaultRemoteUserName',
        'Собеседник'
      )
    const parts = fullName.split(' ')
    if (parts.length >= 2) {
      return `${parts[1]} ${parts[0]}`
    }
    return parts[0]
  }

  private getInitials(name: string): string {
    if (!name) return '??'
    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      const lastNameInitial = nameParts[0] ? nameParts[0].charAt(0) : ''
      const firstNameInitial = nameParts[1] ? nameParts[1].charAt(0) : ''
      return (lastNameInitial + firstNameInitial).toUpperCase()
    } else if (nameParts.length === 1 && nameParts[0]) {
      return nameParts[0].substring(0, 2).toUpperCase()
    }
    return '??'
  }

  private setDefaultLocalParticipantInfo(baseUser: { userName?: string }) {
    const nameToFormat =
      baseUser.userName ||
      this.translatePipe.transform('videochat.fallbackUserName', 'User')
    this.localParticipantInfo.next({
      displayName: this.formatLocalUserName(nameToFormat),
      avatarUrl: undefined,
      isCurrentUser: true,
      cameraOn: false,
      micOn: true,
      initials: this.getInitials(nameToFormat),
    })
  }

  public isSecureConnection(): boolean {
    return navigator.mediaDevices != undefined
  }

  public NotifyIncomeCall(chatId: number): boolean {
    if (this.currentChatId !== chatId) {
      if (
        this.isActiveCall.getValue() ||
        this.isIncomingCall.getValue() ||
        this.isOutgoingCall.getValue()
      ) {
        return false
      }
    }
    this.currentChatId = chatId
    this.loadRemoteChatInfo(chatId)
    this.isIncomingCall.next(true)
    this.isActiveCall.next(false)
    this.isOutgoingCall.next(false)
    return true
  }

  public SetActiveCall(chatId: number): boolean {
    if (this.currentChatId !== null && this.currentChatId !== chatId) {
      if (
        this.isActiveCall.getValue() ||
        this.isIncomingCall.getValue() ||
        this.isOutgoingCall.getValue()
      ) {
        return false
      }
    }
    this.currentChatId = chatId
    this.loadRemoteChatInfo(chatId)
    this.isIncomingCall.next(false)
    this.isOutgoingCall.next(true)
    this.isActiveCall.next(false)
    return true
  }

  private loadRemoteChatInfo(chatId: number) {
    this.chatService.LoadChat(chatId).subscribe((chatInfo: Chat | null) => {
      this._currentRemoteChatInfo = chatInfo
      if (chatInfo && chatInfo.name) {
        const currentRemote = this.remoteParticipantInfo.getValue()
        const cameraOn = currentRemote?.cameraOn ?? false
        const micOn = currentRemote?.micOn ?? true
        const stream = currentRemote?.stream ?? undefined

        this.remoteParticipantInfo.next({
          displayName: this.formatRemoteUserName(chatInfo.name),
          avatarUrl: chatInfo.img || chatInfo.profilePicture,
          isCurrentUser: false,
          cameraOn: cameraOn,
          micOn: micOn,
          initials: this.getInitials(chatInfo.name),
          stream: stream,
        })
      } else {
        this.remoteParticipantInfo.next(null)
      }
    })
  }

  public getCurrentRemoteChatInfo(): Chat {
    return this._currentRemoteChatInfo
  }

  public updateLocalCameraStatus(isOn: boolean) {
    const currentLocal = this.localParticipantInfo.getValue()
    if (currentLocal) {
      this.localParticipantInfo.next({ ...currentLocal, cameraOn: isOn })
    }
  }

  public updateLocalMicStatus(isOn: boolean) {
    const currentLocal = this.localParticipantInfo.getValue()
    if (currentLocal) {
      this.localParticipantInfo.next({ ...currentLocal, micOn: isOn })
    }
  }

  public updateRemoteCameraStatus(isOn: boolean) {
    const currentRemote = this.remoteParticipantInfo.getValue()
    if (currentRemote) {
      this.remoteParticipantInfo.next({ ...currentRemote, cameraOn: isOn })
    }
  }

  public updateRemoteMicStatus(isOn: boolean) {
    const currentRemote = this.remoteParticipantInfo.getValue()
    if (currentRemote) {
      this.remoteParticipantInfo.next({ ...currentRemote, micOn: isOn })
    }
  }

  public updateRemoteStream(stream: MediaStream | null) {
    const currentRemote = this.remoteParticipantInfo.getValue()
    if (currentRemote) {
      this.remoteParticipantInfo.next({ ...currentRemote, stream: stream })
    } else if (stream === null && this.remoteParticipantInfo.value) {
      this.remoteParticipantInfo.next({
        ...this.remoteParticipantInfo.value,
        stream: undefined,
      })
    }
  }

  public updateLocalStream(stream: MediaStream | null) {
    const currentLocal = this.localParticipantInfo.getValue()
    if (currentLocal) {
      this.localParticipantInfo.next({ ...currentLocal, stream: stream })
    } else if (stream === null && this.localParticipantInfo.value) {
      this.localParticipantInfo.next({
        ...this.localParticipantInfo.value,
        stream: undefined,
      })
    }
  }

  public DisconnectUser(chatId: number, userId: number) {
    this.endCall(chatId)
  }

  public disconnectFromCall() {
    this.endCall(this.currentChatId)
  }

  public answerCall(): boolean {
    if (this.currentChatId === null) return false
    this.isIncomingCall.next(false)
    this.isOutgoingCall.next(false)
    this.isActiveCall.next(true)
    return true
  }

  public acceptOutgoingCall(): void {
    if (this.isOutgoingCall.getValue()) {
      this.isOutgoingCall.next(false)
      this.isActiveCall.next(true)
    }
  }

  public endCall(chatId: number | null = null) {
    if (chatId !== null && this.currentChatId !== chatId) {
      return
    }

    this.currentChatId = null
    this._currentRemoteChatInfo = null
    this.isActiveCall.next(false)
    this.isIncomingCall.next(false)
    this.isOutgoingCall.next(false)
    this.remoteParticipantInfo.next(null)

    const currentLocal = this.localParticipantInfo.getValue()
    if (currentLocal) {
      this.localParticipantInfo.next({
        ...currentLocal,
        cameraOn: false,
        micOn: true,
        stream: undefined,
      })
    }
  }

  public isChatMatch(chatId: number): boolean {
    return this.currentChatId === chatId
  }

  public joinGroupCall(chatId: number): void {
    if (
      this.activeGroupCallId.getValue() !== null ||
      this.isActiveCall.getValue()
    ) {
      return
    }
    this.activeGroupCallId.next(chatId)
    const self = this.localParticipantInfo.getValue()
    if (self) {
      const newMap = new Map<string, IVideoParticipant>()
      const selfId = this.signalingGateway.selfConnectionId
      if (selfId) {
        newMap.set(selfId, self)
        this.groupCallParticipants.next(newMap)
      }
    }
  }

  public leaveGroupCall(): void {
    const chatId = this.activeGroupCallId.getValue()
    if (chatId !== null) {
      this.signalingGateway.leaveGroupCall(chatId)
      this.resetGroupCallState()
    }
  }

  public handleGroupCallEnded(chatId: number): void {
    if (this.activeGroupCallId.getValue() === chatId) {
      this.resetGroupCallState()
    }
  }

  public addGroupParticipant(
    connectionId: string,
    participant: IVideoParticipant
  ): void {
    const currentParticipants = this.groupCallParticipants.getValue()
    currentParticipants.set(connectionId, participant)
    this.groupCallParticipants.next(new Map(currentParticipants))
  }

  public removeGroupParticipant(connectionId: string): void {
    const currentParticipants = this.groupCallParticipants.getValue()
    currentParticipants.delete(connectionId)
    this.groupCallParticipants.next(new Map(currentParticipants))
  }

  private resetGroupCallState(): void {
    this.activeGroupCallId.next(null)
    this.groupCallParticipants.next(new Map())
  }
}
