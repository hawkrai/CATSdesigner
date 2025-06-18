import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  HostListener,
} from '@angular/core'
import { Subscription, Observable, combineLatest, BehaviorSubject } from 'rxjs'
import {
  map,
  tap,
  distinctUntilChanged,
  filter,
  first,
  auditTime,
} from 'rxjs/operators'
import { SignalRService } from '@chat/shared/services/signalRSerivce'
import { VideoChatService } from '@app/modules/video-chat/services/video-chat.service'
import { IVideoParticipant } from '@app/modules/video-chat/interfaces/videoParticipant.interface'
import { StreamHandlerComponent } from '@app/modules/video-chat/components/stream-handler/stream-handler.component'

@Component({
  selector: 'app-video-handler',
  templateUrl: './video-handler.component.html',
  styleUrls: ['./video-handler.component.scss'],
})
export class VideoHandlerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('selfVideoElement')
  selfVideoElementRef!: ElementRef<HTMLVideoElement>
  @ViewChild('remoteVideoElement')
  remoteVideoElementRef!: ElementRef<HTMLVideoElement>

  @ViewChild('videoContainer') videoContainerRef!: ElementRef<HTMLDivElement>
  private videoElements = new Map<string, HTMLVideoElement>()

  private _streamHandlerInstance!: StreamHandlerComponent
  @ViewChild('streamHandlerRef') set streamHandlerRef(
    handler: StreamHandlerComponent
  ) {
    if (handler) {
      this._streamHandlerInstance = handler
      if (!this.streamHandlerReady.getValue()) {
        this.streamHandlerReady.next(true)
      }
    } else {
      this._streamHandlerInstance = undefined
      if (this.streamHandlerReady.getValue()) {
        this.streamHandlerReady.next(false)
      }
    }
  }

  get streamHandler(): StreamHandlerComponent {
    return this._streamHandlerInstance
  }

  public callState$: Observable<{
    isActive: boolean | null
    isIncoming: boolean | null
    isOutgoing: boolean | null
    shouldShowOverlay: boolean | null
  }>

  public groupParticipants$: Observable<IVideoParticipant[]>
  public isMobileView = false
  public isSelfOverlayVisible = true
  private selfOverlayHideTimer: any = null
  public localParticipant: IVideoParticipant | null = null
  public remoteParticipant: IVideoParticipant | null = null

  public isMicActive = true
  public isCameraActive = false
  public hasRemoteStream = false
  public shouldInitStreamHandler = false
  public isOutgoingCallAnimating = false
  public readonly outgoingCallAnimationDurationMs

  private subscriptions = new Subscription()
  private streamHandlerReady = new BehaviorSubject<boolean>(false)

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.checkScreenWidth()
  }

  constructor(
    public videoChatService: VideoChatService,
    private signalRService: SignalRService,
    private cdr: ChangeDetectorRef
  ) {
    this.outgoingCallAnimationDurationMs = signalRService.chatTimeOut
    this.callState$ = combineLatest([
      this.videoChatService.isActiveCall,
      this.videoChatService.isIncomingCall,
      this.videoChatService.isOutgoingCall,
    ]).pipe(
      distinctUntilChanged(
        (prev, curr) =>
          prev[0] === curr[0] && prev[1] === curr[1] && prev[2] === curr[2]
      ),
      map(([isActive, isIncoming, isOutgoing]) => ({
        isActive: isActive,
        isIncoming: isIncoming,
        isOutgoing: isOutgoing,
        shouldShowOverlay:
          isActive ||
          isIncoming ||
          isOutgoing ||
          this.videoChatService.activeGroupCallId.getValue() !== null,
      }))
    )
  }

  ngOnInit(): void {
    this.checkScreenWidth()

    this.groupParticipants$ = this.videoChatService.groupCallParticipants.pipe(
      map((participantsMap) => Array.from(participantsMap.values()))
    )

    const callStateSub = combineLatest([
      this.videoChatService.isActiveCall,
      this.videoChatService.isOutgoingCall,
      this.videoChatService.isIncomingCall,
      this.videoChatService.activeGroupCallId,
    ])
      .pipe(auditTime(0))
      .subscribe(([isActive, isOutgoing, isIncoming, activeGroupCallId]) => {
        const inCallProcess =
          isActive || isOutgoing || isIncoming || activeGroupCallId !== null
        const isOutgoingCall = isOutgoing && !isActive && !isIncoming

        if (isActive || activeGroupCallId !== null) {
          this.showSelfOverlay()
        }

        if (isOutgoingCall) {
          if (!this.isOutgoingCallAnimating) this.isOutgoingCallAnimating = true
        } else if (this.isOutgoingCallAnimating) {
          this.isOutgoingCallAnimating = false
        }

        if (inCallProcess && !this.shouldInitStreamHandler) {
          this.shouldInitStreamHandler = true
          this.cdr.detectChanges()

          this.streamHandlerReady
            .pipe(
              filter((ready) => ready),
              first()
            )
            .subscribe(() => {
              if (this.streamHandler && !this.localParticipant?.stream) {
                this.streamHandler.initializeMedia()
              }
            })
        } else if (!inCallProcess && this.shouldInitStreamHandler) {
          this.shouldInitStreamHandler = false
          this.cdr.detectChanges()
        }
      })

    this.subscriptions.add(callStateSub)

    const localParticipantSub =
      this.videoChatService.localParticipantInfo.subscribe((p) => {
        this.localParticipant = p
        if (p) {
          this.isMicActive = p.micOn
          this.isCameraActive = p.cameraOn
          if (p.stream && this.selfVideoElementRef?.nativeElement) {
            this.setVideoSrcObject(
              this.selfVideoElementRef.nativeElement,
              p.stream
            )
          }
        }
        this.cdr.markForCheck()
      })
    this.subscriptions.add(localParticipantSub)

    const remoteParticipantSub =
      this.videoChatService.remoteParticipantInfo.subscribe((p) => {
        this.remoteParticipant = p
        this.hasRemoteStream = !!p?.stream
        if (p?.stream && this.remoteVideoElementRef?.nativeElement) {
          this.setVideoSrcObject(
            this.remoteVideoElementRef.nativeElement,
            p.stream
          )
        } else if (this.remoteVideoElementRef?.nativeElement) {
          this.remoteVideoElementRef.nativeElement.srcObject = null
          this.hasRemoteStream = false
        }
        this.cdr.markForCheck()
      })
    this.subscriptions.add(remoteParticipantSub)
  }

  ngAfterViewInit(): void {
    if (this.localParticipant?.stream && this.selfVideoElementRef) {
      this.setVideoSrcObject(
        this.selfVideoElementRef.nativeElement,
        this.localParticipant.stream
      )
    }
    if (this.remoteParticipant?.stream && this.remoteVideoElementRef) {
      this.setVideoSrcObject(
        this.remoteVideoElementRef.nativeElement,
        this.remoteParticipant.stream
      )
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.stopCallSound('outgoingCallSound')
    this.stopCallSound('incomingCallSound')
    if (this.videoChatService.currentChatId !== null) this.endCall()
    if (this.videoChatService.activeGroupCallId.getValue() !== null)
      this.endCall()
  }

  setVideoSrcObject(element: HTMLVideoElement, stream: MediaStream | null) {
    if (element && element.srcObject !== stream) {
      element.srcObject = stream
    }
  }

  trackByConnectionId(index: number, participant: IVideoParticipant): string {
    const participantsMap =
      this.videoChatService.groupCallParticipants.getValue()
    for (const [key, value] of participantsMap.entries()) {
      if (value === participant) {
        return key
      }
    }
    return participant.displayName
  }

  getInitials(name: string): string {
    if (!name) return '??'
    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
    } else if (nameParts.length === 1 && nameParts[0]) {
      return nameParts[0].substring(0, 2).toUpperCase()
    }
    return '??'
  }

  onSelfStreamReady(stream: MediaStream): void {
    this.videoChatService.updateLocalStream(stream)
  }

  onRemoteStreamReady(stream: MediaStream): void {
    this.videoChatService.updateRemoteStream(stream)
    this.hasRemoteStream = true
    this.stopCallSound('outgoingCallSound')
    if (this.videoChatService.currentChatId !== null) {
      this.signalRService.callWasConfirmed(this.videoChatService.currentChatId)
    }
    this.cdr.markForCheck()
  }

  onCallAcceptedByRemote(): void {
    this.stopCallSound('outgoingCallSound')
    if (this.videoChatService.isOutgoingCall.getValue()) {
      this.videoChatService.acceptOutgoingCall()
    }
    if (this.videoChatService.currentChatId !== null) {
      this.signalRService.callWasConfirmed(this.videoChatService.currentChatId)
    }
    this.cdr.markForCheck()
  }

  onRemoteUserDisconnected(): void {
    this.hasRemoteStream = false
    if (this.videoChatService.currentChatId !== null) {
      this.videoChatService.endCall(this.videoChatService.currentChatId)
    }
    if (this.remoteVideoElementRef)
      this.remoteVideoElementRef.nativeElement.srcObject = null
    this.cdr.markForCheck()
  }

  answerCall(): void {
    if (this.videoChatService.answerCall()) {
      this.stopCallSound('incomingCallSound')
      this.streamHandlerReady
        .pipe(
          filter((ready) => ready),
          first()
        )
        .subscribe(() => {
          if (this.streamHandler) {
            this.streamHandler.initializeMedia().then(() => {
              if (this.videoChatService.currentChatId !== null) {
                this.signalRService.setVoiceChatConnection(
                  this.videoChatService.currentChatId
                )
              }
            })
          }
        })
    }
  }

  rejectCall(): void {
    this.stopCallSound('incomingCallSound')
    if (this.videoChatService.currentChatId !== null) {
      this.signalRService.sendRejection(
        this.videoChatService.currentChatId,
        'Call rejected'
      )
      this.videoChatService.endCall(this.videoChatService.currentChatId)
    }
  }

  endCall(): void {
    this.stopCallSound('outgoingCallSound')
    this.stopCallSound('incomingCallSound')

    const personalChatId = this.videoChatService.currentChatId
    const groupChatId = this.videoChatService.activeGroupCallId.getValue()

    if (this.streamHandler) {
      this.streamHandler.cleanupConnections()
    }

    if (personalChatId !== null) {
      this.signalRService.disconnectFromCall(personalChatId)
      this.videoChatService.endCall(personalChatId)
    } else if (groupChatId !== null) {
      this.videoChatService.leaveGroupCall()
    } else {
      this.videoChatService.endCall(null)
    }
    this.cdr.markForCheck()
  }

  cancelOutgoingCall(): void {
    this.endCall()
  }

  toggleMicrophone(): void {
    this.isMicActive = !this.isMicActive
    this.videoChatService.updateLocalMicStatus(this.isMicActive)
    if (this.streamHandler) {
      this.streamHandler.toggleMicrophone(this.isMicActive)
    }
    const chatId =
      this.videoChatService.currentChatId ??
      this.videoChatService.activeGroupCallId.getValue()
    if (chatId !== null) {
      this.signalRService.sendMediaStatusUpdate(
        chatId,
        'microphone',
        this.isMicActive
      )
    }
    this.showSelfOverlay()
  }

  toggleCamera(): void {
    this.isCameraActive = !this.isCameraActive
    this.videoChatService.updateLocalCameraStatus(this.isCameraActive)
    if (this.streamHandler) {
      this.streamHandler.toggleCamera(this.isCameraActive)
    }
    const chatId =
      this.videoChatService.currentChatId ??
      this.videoChatService.activeGroupCallId.getValue()
    if (chatId !== null) {
      this.signalRService.sendMediaStatusUpdate(
        chatId,
        'camera',
        this.isCameraActive
      )
    }
    this.showSelfOverlay()
  }

  private stopCallSound(soundId: string): void {
    const audioElement = document.getElementById(soundId) as HTMLAudioElement
    if (audioElement) {
      if (!audioElement.paused) audioElement.pause()
      audioElement.currentTime = 0
    }
  }

  private checkScreenWidth(): void {
    this.isMobileView = window.innerWidth < 992
    if (!this.isMobileView) {
      this.isSelfOverlayVisible = true
      if (this.selfOverlayHideTimer) {
        clearTimeout(this.selfOverlayHideTimer)
        this.selfOverlayHideTimer = null
      }
    }
  }

  public onSelfVideoClick(): void {
    if (this.isMobileView) {
      this.showSelfOverlay()
    }
  }

  private showSelfOverlay(): void {
    if (this.selfOverlayHideTimer) clearTimeout(this.selfOverlayHideTimer)
    this.isSelfOverlayVisible = true
    this.cdr.markForCheck()

    if (this.isMobileView) {
      this.selfOverlayHideTimer = setTimeout(() => {
        this.isSelfOverlayVisible = false
        this.cdr.markForCheck()
      }, 4000)
    }
  }
}
