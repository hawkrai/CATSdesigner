import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { VideoChatService } from '@app/modules/video-chat/services/video-chat.service'
import { WebRtcSignalingGateway } from '../../services/webrtc-signaling.gateway'
import { ChatApiService } from '@chat/shared/api/chat-api.service'
import { IVideoParticipant } from '../../interfaces/videoParticipant.interface'
import { User } from '@chat/shared/models/dto/user'

const configuration = {
  configuration: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  },
  iceServers: [
    { urls: 'stun:openrelay.metered.ca:80' },
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com',
    },
    {
      urls: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808',
    },
    {
      urls: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808',
    },
    {
      urls: 'turn:turn.bistri.com:80',
      credential: 'homeo',
      username: 'homeo',
    },
    {
      urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
      credential: 'webrtc',
      username: 'webrtc',
    },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
}

const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
}

@Component({
  selector: 'app-stream-handler',
  template: '',
})
export class StreamHandlerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() initialMicStatus = true
  @Input() initialVideoStatus = false
  @Output() selfStreamReady = new EventEmitter<MediaStream>()
  @Output() remoteStreamReady = new EventEmitter<MediaStream>()
  @Output() callAcceptedByRemote = new EventEmitter<void>()
  @Output() remoteUserDisconnected = new EventEmitter<void>()

  private peerConnections = new Map<string, RTCPeerConnection>()
  private localStream: MediaStream | null = null
  private subscriptions = new Subscription()
  private isGroupCall = false

  constructor(
    private signalingGateway: WebRtcSignalingGateway,
    private videoChatService: VideoChatService,
    private chatApiService: ChatApiService
  ) {}

  ngOnInit(): void {
    this.isGroupCall =
      this.videoChatService.activeGroupCallId.getValue() !== null
    this.setupSignalingListeners()

    if (this.isGroupCall) {
      const chatId = this.videoChatService.activeGroupCallId.getValue()
      if (chatId !== null) {
        this.signalingGateway.joinGroupCall(chatId)
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.localStream) {
      if (changes.initialMicStatus) {
        this.setTrackEnabled('audio', changes.initialMicStatus.currentValue)
      }
      if (changes.initialVideoStatus) {
        this.setTrackEnabled('video', changes.initialVideoStatus.currentValue)
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanupConnections()
    this.subscriptions.unsubscribe()
  }

  public async initializeMedia(): Promise<void> {
    if (this.localStream) {
      this.selfStreamReady.emit(this.localStream)
      return
    }
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: true,
      })

      this.setTrackEnabled('audio', this.initialMicStatus)
      this.setTrackEnabled('video', this.initialVideoStatus)

      this.videoChatService.updateLocalStream(this.localStream)
      this.videoChatService.updateLocalCameraStatus(this.initialVideoStatus)
      this.videoChatService.updateLocalMicStatus(this.initialMicStatus)

      this.selfStreamReady.emit(this.localStream)

      this.peerConnections.forEach((pc) => {
        this.localStream?.getTracks().forEach((track) => {
          if (!pc.getSenders().find((s) => s.track === track)) {
            pc.addTrack(track, this.localStream!)
          }
        })
      })
    } catch (e) {
      console.error('Error getting user media:', e)
      this.videoChatService.disconnectFromCall()
    }
  }

  private setupSignalingListeners(): void {
    const personalCallSub =
      this.signalingGateway.onPersonalCallNewcomer$.subscribe((peerId) => {
        if (!this.isGroupCall) {
          this.callAcceptedByRemote.emit()
          this.createPeerConnection(peerId, true)
        }
      })

    const existingParticipantsSub =
      this.signalingGateway.onGroupCallExistingParticipants$.subscribe(
        (participants) => {
          if (this.isGroupCall) {
            for (const connectionId in participants) {
              if (connectionId !== this.signalingGateway.selfConnectionId) {
                const userId = participants[connectionId]
                this.fetchUserInfoAndAddParticipant(connectionId, userId, null)
                this.createPeerConnection(connectionId, true)
              }
            }
          }
        }
      )

    const newParticipantSub =
      this.signalingGateway.onGroupCallNewParticipant$.subscribe(
        (participantInfo) => {
          if (this.isGroupCall) {
            for (const connectionId in participantInfo) {
              const userId = participantInfo[connectionId]
              this.fetchUserInfoAndAddParticipant(connectionId, userId, null)
            }
          }
        }
      )

    const participantLeftSub =
      this.signalingGateway.onGroupCallParticipantLeft$.subscribe(
        ({ connectionId }) => {
          if (this.isGroupCall) {
            this.handleDisconnection(connectionId)
          }
        }
      )

    const offerSub = this.signalingGateway.onOffer$.subscribe(
      async ({ fromConnectionId, offer }) => {
        if (fromConnectionId === this.signalingGateway.selfConnectionId) return

        await this.createPeerConnection(fromConnectionId, false, offer)
      }
    )

    const answerSub = this.signalingGateway.onAnswer$.subscribe(
      async ({ fromConnectionId, answer }) => {
        const pc = this.peerConnections.get(fromConnectionId)
        if (
          pc &&
          (pc.signalingState === 'have-local-offer' ||
            pc.signalingState === 'stable')
        ) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer))
          } catch (e) {
            console.error('Error setting remote description for answer:', e)
          }
        }
      }
    )

    const candidateSub = this.signalingGateway.onCandidate$.subscribe(
      async ({ fromConnectionId, candidate }) => {
        const pc = this.peerConnections.get(fromConnectionId)
        if (pc && candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          } catch (e) {
            console.error('Error adding received ice candidate:', e)
          }
        }
      }
    )

    this.subscriptions.add(personalCallSub)
    this.subscriptions.add(existingParticipantsSub)
    this.subscriptions.add(newParticipantSub)
    this.subscriptions.add(participantLeftSub)
    this.subscriptions.add(offerSub)
    this.subscriptions.add(answerSub)
    this.subscriptions.add(candidateSub)
  }

  private async createPeerConnection(
    peerId: string,
    isOfferer: boolean,
    offer?: RTCSessionDescriptionInit
  ): Promise<void> {
    if (
      this.peerConnections.has(peerId) ||
      peerId === this.signalingGateway.selfConnectionId
    ) {
      return
    }

    if (!this.localStream) {
      await this.initializeMedia()
      if (!this.localStream) {
        console.error(
          'Local stream is not available, cannot create peer connection.'
        )
        return
      }
    }

    const pc = new RTCPeerConnection(configuration)
    this.peerConnections.set(peerId, pc)

    this.localStream?.getTracks().forEach((track) => {
      if (!pc.getSenders().find((s) => s.track === track)) {
        pc.addTrack(track, this.localStream!)
      }
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingGateway.sendCandidate(peerId, event.candidate)
      }
    }

    pc.ontrack = (event) => {
      const stream = event.streams[0]
      if (this.isGroupCall) {
        const participants =
          this.videoChatService.groupCallParticipants.getValue()
        const participant = participants.get(peerId)
        if (participant) {
          participant.stream = stream
          this.videoChatService.addGroupParticipant(peerId, { ...participant })
        }
      } else {
        this.remoteStreamReady.emit(stream)
        this.videoChatService.updateRemoteStream(stream)
      }
    }

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === 'failed' ||
        pc.connectionState === 'disconnected' ||
        pc.connectionState === 'closed'
      ) {
        this.handleDisconnection(peerId)
      }
    }

    if (isOfferer) {
      try {
        const createdOffer = await pc.createOffer(offerOptions)
        await pc.setLocalDescription(createdOffer)
        this.signalingGateway.sendOffer(peerId, pc.localDescription)
      } catch (e) {
        console.error('Error creating offer:', e)
      }
    } else if (offer) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        this.signalingGateway.sendAnswer(peerId, pc.localDescription)
      } catch (e) {
        console.error('Error handling offer and creating answer:', e)
      }
    }
  }

  private fetchUserInfoAndAddParticipant(
    connectionId: string,
    userId: number,
    stream: MediaStream | null
  ): void {
    this.chatApiService.getUserInfoById(userId).subscribe({
      next: (user: User) => {
        const newParticipant: IVideoParticipant = {
          userId: user.userId,
          displayName: user.fullName,
          avatarUrl: user.profile,
          initials: this.getInitials(user.fullName),
          isCurrentUser: false,
          cameraOn: false,
          micOn: false,
          stream: stream,
        }
        this.videoChatService.addGroupParticipant(connectionId, newParticipant)
      },
      error: () => {
        const tempParticipant: IVideoParticipant = {
          userId: userId,
          displayName: `User ${userId}`,
          isCurrentUser: false,
          cameraOn: false,
          micOn: false,
          stream: stream,
          initials: 'U',
        }
        this.videoChatService.addGroupParticipant(connectionId, tempParticipant)
      },
    })
  }

  private getInitials(name: string): string {
    if (!name) return '??'
    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
    } else if (nameParts.length === 1 && nameParts[0]) {
      return nameParts[0].substring(0, 2).toUpperCase()
    }
    return '??'
  }

  private setTrackEnabled(kind: 'audio' | 'video', enabled: boolean): void {
    this.localStream?.getTracks().forEach((track) => {
      if (track.kind === kind) {
        track.enabled = enabled
      }
    })
  }

  private handleDisconnection(peerId: string): void {
    const pc = this.peerConnections.get(peerId)
    if (pc) {
      pc.close()
      this.peerConnections.delete(peerId)
    }

    if (this.isGroupCall) {
      this.videoChatService.removeGroupParticipant(peerId)
    } else {
      if (this.peerConnections.size === 0) {
        this.remoteUserDisconnected.emit()
        this.videoChatService.updateRemoteStream(null)
      }
    }
  }

  public cleanupConnections(): void {
    this.peerConnections.forEach((pc) => pc.close())
    this.peerConnections.clear()

    this.localStream?.getTracks().forEach((track) => track.stop())
    this.localStream = null

    this.videoChatService.updateLocalStream(null)
    if (this.isGroupCall) {
      this.videoChatService.leaveGroupCall()
    } else {
      this.videoChatService.updateRemoteStream(null)
    }
  }

  public toggleMicrophone(active: boolean): void {
    this.setTrackEnabled('audio', active)
  }

  public toggleCamera(active: boolean): void {
    this.setTrackEnabled('video', active)
  }
}
