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

import { SignalRService } from '@chat/shared/services/signalRSerivce'
import { VideoChatService } from '@app/modules/video-chat/services/video-chat.service'

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

const options = {
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

  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private localStream: MediaStream | null = null

  constructor(
    private signalRService: SignalRService,
    private videoChatService: VideoChatService
  ) {}

  ngOnInit(): void {
    this.setupSignalRListeners()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.localStream) {
      if (changes.initialMicStatus) {
        const newMicStatus = changes.initialMicStatus.currentValue
        this.setTrackEnabled('audio', newMicStatus)
      }
      if (changes.initialVideoStatus) {
        const newVideoStatus = changes.initialVideoStatus.currentValue
        this.setTrackEnabled('video', newVideoStatus)
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanupConnections()
    this.removeSignalRListeners()
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
          if (pc.getSenders().find((s) => s.track === track)) {
            return
          }
          pc.addTrack(track, this.localStream!)
        })
      })
    } catch (e) {
      this.videoChatService.endCall(this.videoChatService.currentChatId)
    }
  }

  private setupSignalRListeners(): void {
    this.signalRService.hubConnection.on(
      'AddNewcomer',
      async (newcomerConnectionId: string, chatId: number) => {
        if (newcomerConnectionId === this.signalRService.selfConnectionId)
          return
        if (!this.videoChatService.isChatMatch(chatId)) {
          return
        }
        this.callAcceptedByRemote.emit()
        await this.createPeerConnection(newcomerConnectionId, chatId, true)
      }
    )

    this.signalRService.hubConnection.on(
      'RegisterOffer',
      async (
        chatId: number,
        offer: RTCSessionDescriptionInit,
        fromClientHubId: string
      ) => {
        if (fromClientHubId === this.signalRService.selfConnectionId) return
        if (!this.videoChatService.isChatMatch(chatId)) {
          return
        }
        this.callAcceptedByRemote.emit()
        await this.createPeerConnection(fromClientHubId, chatId, false, offer)
      }
    )

    this.signalRService.hubConnection.on(
      'RegisterAnswer',
      async (answer: RTCSessionDescriptionInit, userConnectionId: string) => {
        if (userConnectionId === this.signalRService.selfConnectionId) return
        const pc = this.peerConnections.get(userConnectionId)
        if (pc) {
          if (
            pc.signalingState === 'have-local-offer' ||
            pc.signalingState === 'stable'
          ) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(answer))
            } catch (e) {}
          }
        }
      }
    )

    this.signalRService.hubConnection.on(
      'HandleNewCandidate',
      async (candidate: RTCIceCandidateInit, userConnectionId: string) => {
        if (userConnectionId === this.signalRService.selfConnectionId) return
        const pc = this.peerConnections.get(userConnectionId)
        if (pc && candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          } catch (e) {}
        }
      }
    )
  }

  private async createPeerConnection(
    peerId: string,
    chatId: number,
    isOfferer: boolean,
    offer?: RTCSessionDescriptionInit
  ): Promise<void> {
    if (this.peerConnections.has(peerId)) {
      return
    }

    if (!this.localStream) {
      await this.initializeMedia()
      if (!this.localStream) {
        return
      }
    }

    const pc = new RTCPeerConnection(configuration)
    this.peerConnections.set(peerId, pc)

    this.localStream?.getTracks().forEach((track) => {
      if (pc.getSenders().find((s) => s.track === track)) {
        return
      }
      pc.addTrack(track, this.localStream!)
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalRService.hubConnection?.invoke(
          'FireCandidate',
          event.candidate,
          peerId
        )
      }
    }

    pc.oniceconnectionstatechange = () => {}

    pc.ontrack = (event) => {
      const stream = event.streams[0]
      if (stream) {
        event.track.onunmute = () => {}
        this.remoteStreamReady.emit(stream)
        this.videoChatService.updateRemoteStream(stream)
      } else {
        let inboundStream = new MediaStream()
        inboundStream.addTrack(event.track)
        this.remoteStreamReady.emit(inboundStream)
        this.videoChatService.updateRemoteStream(inboundStream)
      }
    }

    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case 'connected':
          break
        case 'disconnected':
        case 'failed':
        case 'closed':
          this.handleDisconnection(peerId)
          break
      }
    }

    if (isOfferer) {
      try {
        const createdOffer = await pc.createOffer(options)
        await pc.setLocalDescription(createdOffer)
        this.signalRService.hubConnection?.invoke(
          'SendOffer',
          chatId,
          pc.localDescription,
          peerId
        )
      } catch (e) {}
    } else if (offer) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        this.signalRService.hubConnection?.invoke(
          'SendAnswer',
          pc.localDescription,
          peerId
        )
      } catch (e) {}
    }
  }

  private setTrackEnabled(kind: 'audio' | 'video', enabled: boolean): void {
    if (!this.localStream) {
      return
    }
    this.localStream.getTracks().forEach((track) => {
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
    if (this.peerConnections.size === 0) {
      this.remoteUserDisconnected.emit()
      this.videoChatService.updateRemoteStream(null)
    }
  }

  public cleanupConnections(): void {
    this.peerConnections.forEach((pc, peerId) => {
      pc.close()
    })
    this.peerConnections.clear()

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
    this.videoChatService.updateLocalStream(null)
    this.videoChatService.updateRemoteStream(null)
  }

  private removeSignalRListeners(): void {
    this.signalRService.hubConnection.off('AddNewcomer')
    this.signalRService.hubConnection.off('RegisterOffer')
    this.signalRService.hubConnection.off('RegisterAnswer')
    this.signalRService.hubConnection.off('HandleNewCandidate')
  }

  public toggleMicrophone(active: boolean): void {
    this.setTrackEnabled('audio', active)
  }

  public toggleCamera(active: boolean): void {
    this.setTrackEnabled('video', active)
  }
}
