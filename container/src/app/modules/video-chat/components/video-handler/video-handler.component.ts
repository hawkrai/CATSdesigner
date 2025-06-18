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

  public isMobileView = false
  public isSelfOverlayVisible = true
  private selfOverlayHideTimer: any = null
  public localParticipant: IVideoParticipant | null = null
  public remoteParticipant: IVideoParticipant | null = null

  public isMicActive = true
  public isCameraActive = false
  public isCallFullyEstablished = false
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
        shouldShowOverlay: isActive || isIncoming || isOutgoing,
      }))
    )
  }

  ngOnInit(): void {
    this.checkScreenWidth()
    this.subscriptions.add(
      this.videoChatService.localParticipantInfo.subscribe((p) => {
        this.localParticipant = p
        if (p) {
          this.isMicActive = p.micOn
          this.isCameraActive = p.cameraOn
          if (p.stream) {
            this.setSelfVideoSrcObject(p.stream)
          } else if (this.selfVideoElementRef?.nativeElement?.srcObject) {
            this.selfVideoElementRef.nativeElement.srcObject = null
          }
        }
        this.cdr.markForCheck()
      })
    )

    this.subscriptions.add(
      this.videoChatService.remoteParticipantInfo.subscribe((p) => {
        const prevCameraOn = this.remoteParticipant?.cameraOn
        this.remoteParticipant = p
        this.hasRemoteStream = !!p?.stream
        if (prevCameraOn !== undefined && prevCameraOn !== p?.cameraOn) {
        }
        if (p?.stream) {
          this.setRemoteVideoSrcObject(p.stream)
        } else if (this.remoteVideoElementRef?.nativeElement?.srcObject) {
          this.remoteVideoElementRef.nativeElement.srcObject = null
          this.hasRemoteStream = false
        }
        this.cdr.markForCheck()
      })
    )

    this.subscriptions.add(
      combineLatest([
        this.videoChatService.isActiveCall,
        this.videoChatService.isOutgoingCall,
        this.videoChatService.isIncomingCall,
      ])
        .pipe(
          auditTime(0),
          distinctUntilChanged(
            (prev, curr) =>
              prev[0] === curr[0] && prev[1] === curr[1] && prev[2] === curr[2]
          ),
          tap(([isActive, isOutgoing, isIncoming]) => {
            const inCallProcess = isActive || isOutgoing || isIncoming
            const isOutgoingCall = isOutgoing && !isActive && !isIncoming
            if (isActive) {
              this.showSelfOverlay()
            }
            if (isOutgoingCall) {
              if (!this.isOutgoingCallAnimating) {
                this.isOutgoingCallAnimating = true
              }
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
                  if (
                    this.streamHandler &&
                    (this.videoChatService.isOutgoingCall.getValue() ||
                      (this.videoChatService.isActiveCall.getValue() &&
                        !this.localParticipant?.stream) ||
                      (this.videoChatService.isIncomingCall.getValue() &&
                        !this.videoChatService.isActiveCall.getValue())) &&
                    !this.localParticipant?.stream
                  ) {
                    this.streamHandler.initializeMedia()
                  }
                })
            } else if (!inCallProcess && this.shouldInitStreamHandler) {
              this.shouldInitStreamHandler = false
              this.cdr.detectChanges()
            }
          })
        )
        .subscribe()
    )
  }

  ngAfterViewInit(): void {
    if (this.streamHandler && !this.streamHandlerReady.getValue()) {
      this.streamHandlerReady.next(true)
    }
    if (
      this.localParticipant?.stream &&
      this.selfVideoElementRef?.nativeElement &&
      !this.selfVideoElementRef.nativeElement.srcObject
    ) {
      this.setSelfVideoSrcObject(this.localParticipant.stream)
    }
    if (
      this.remoteParticipant?.stream &&
      this.remoteVideoElementRef?.nativeElement &&
      !this.remoteVideoElementRef.nativeElement.srcObject
    ) {
      this.setRemoteVideoSrcObject(this.remoteParticipant.stream)
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.stopCallSound('outgoingCallSound')
    this.stopCallSound('incomingCallSound')
    if (this.videoChatService.currentChatId !== null) {
      this.endCall()
    }
  }

  private setSelfVideoSrcObject(stream: MediaStream | null) {
    if (this.selfVideoElementRef?.nativeElement) {
      if (stream) {
        const videoOnlyStream = new MediaStream()
        stream.getVideoTracks().forEach((track) => {
          videoOnlyStream.addTrack(track)
        })

        if (
          this.selfVideoElementRef.nativeElement.srcObject !== videoOnlyStream
        ) {
          this.selfVideoElementRef.nativeElement.srcObject = videoOnlyStream
        } else if (this.selfVideoElementRef.nativeElement.srcObject !== null) {
          this.selfVideoElementRef.nativeElement.srcObject = null
        }
      }
    }
  }

  private setRemoteVideoSrcObject(stream: MediaStream | null) {
    if (
      this.remoteVideoElementRef?.nativeElement &&
      this.remoteVideoElementRef.nativeElement.srcObject !== stream
    ) {
      this.remoteVideoElementRef.nativeElement.srcObject = stream
    }
  }

  onSelfStreamReady(stream: MediaStream): void {
    this.videoChatService.updateLocalStream(stream)
    this.setSelfVideoSrcObject(stream)
    this.cdr.markForCheck()
  }

  onRemoteStreamReady(stream: MediaStream): void {
    this.videoChatService.updateRemoteStream(stream)
    this.setRemoteVideoSrcObject(stream)
    this.hasRemoteStream = true
    this.isCallFullyEstablished = true
    this.stopCallSound('outgoingCallSound')

    if (this.videoChatService.currentChatId !== null) {
      this.signalRService.callWasConfirmed(this.videoChatService.currentChatId)
    }
    this.cdr.markForCheck()
  }

  onCallAcceptedByRemote(): void {
    this.stopCallSound('outgoingCallSound')

    if (
      this.videoChatService.isOutgoingCall.getValue() &&
      !this.videoChatService.isActiveCall.getValue()
    ) {
      this.videoChatService.acceptOutgoingCall()
    }

    if (this.videoChatService.currentChatId !== null) {
      this.signalRService.callWasConfirmed(this.videoChatService.currentChatId)
    }
    this.cdr.markForCheck()
  }

  onRemoteUserDisconnected(): void {
    this.hasRemoteStream = false
    this.isCallFullyEstablished = false
    if (this.videoChatService.currentChatId !== null) {
      this.videoChatService.endCall(this.videoChatService.currentChatId)
    }
    this.setRemoteVideoSrcObject(null)
    this.cdr.markForCheck()
  }

  answerCall(): void {
    if (this.videoChatService.answerCall()) {
      this.stopCallSound('incomingCallSound')
      this.isMicActive = this.localParticipant?.micOn ?? true
      this.isCameraActive = this.localParticipant?.cameraOn ?? false
      this.isCallFullyEstablished = false
      this.cdr.detectChanges()
      this.streamHandlerReady
        .pipe(
          filter((ready) => ready),
          first()
        )
        .subscribe(() => {
          if (this.streamHandler && this.streamHandler.initializeMedia) {
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
    const chatIdToEnd = this.videoChatService.currentChatId

    if (this.streamHandler) {
      this.streamHandler.cleanupConnections()
    }

    if (chatIdToEnd !== null) {
      this.signalRService.disconnectFromCall(chatIdToEnd)
      this.videoChatService.endCall(chatIdToEnd)
    } else {
      this.videoChatService.endCall(null)
    }
    this.cdr.markForCheck()
  }

  cancelOutgoingCall(): void {
    this.stopCallSound('outgoingCallSound')
    const chatIdToCancel = this.videoChatService.currentChatId

    if (this.streamHandler) {
      this.streamHandler.cleanupConnections()
    }

    if (chatIdToCancel !== null) {
      this.signalRService.sendRejection(chatIdToCancel, 'Call cancelled')
      this.signalRService.disconnectFromCall(chatIdToCancel)
      this.videoChatService.endCall(chatIdToCancel)
    }
    this.cdr.markForCheck()
  }

  toggleMicrophone(): void {
    this.isMicActive = !this.isMicActive
    this.videoChatService.updateLocalMicStatus(this.isMicActive)
    if (this.streamHandler) {
      this.streamHandler.toggleMicrophone(this.isMicActive)
    }
    if (this.videoChatService.currentChatId !== null) {
      this.signalRService.sendMediaStatusUpdate(
        this.videoChatService.currentChatId,
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
    if (this.videoChatService.currentChatId !== null) {
      this.signalRService.sendMediaStatusUpdate(
        this.videoChatService.currentChatId,
        'camera',
        this.isCameraActive
      )
    }

    this.showSelfOverlay()
  }

  onRemoteVideoMetadataLoaded(): void {}

  private stopCallSound(soundId: string): void {
    const audioElement = document.getElementById(soundId) as HTMLAudioElement
    if (audioElement) {
      if (!audioElement.paused) {
        audioElement.pause()
      }
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
    if (this.selfOverlayHideTimer) {
      clearTimeout(this.selfOverlayHideTimer)
    }

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
