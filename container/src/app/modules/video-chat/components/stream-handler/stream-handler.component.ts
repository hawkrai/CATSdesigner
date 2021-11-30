import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  OnDestroy,
} from '@angular/core';
import { SignalRService } from 'src/app/modules/chat/shared/services/signalRSerivce';
import { EventEmitter } from '@angular/core';
import { VideoChatService } from './../../services/video-chat.service';

const configuration = {
  configuration: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  },
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const options = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

@Component({
  selector: 'app-stream-handler',
  templateUrl: './stream-handler.component.html',
  styleUrls: ['./stream-handler.component.less'],
})
export class StreamHandlerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isMicroActive = true;
  @Input() isVideoActive = false;
  @Output() clientDisconnected = new EventEmitter();

  private _linkedPeerConnections: Map<string, RTCPeerConnection> = new Map();

  public mediaConstraints = {
    audio: true,
    video: true,
  };

  public remoteAudio: any;
  public selfAudio: any;

  public stream: any;

  constructor(
    private signalRService: SignalRService,
    private videoChatService: VideoChatService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isMicroActive) {
      this.changeMicroStatus(changes.isMicroActive.currentValue);
    }
    if (changes.isVideoActive) {
      this.changeVideoStatus(changes.isVideoActive.currentValue);
    }
  }

  ngOnDestroy(): void {
    this._linkedPeerConnections = new Map();

    this.endChat();
  }

  ngOnInit(): void {
    this.mediaConstraints.audio = this.isMicroActive;
    this.mediaConstraints.video = this.isVideoActive;

    this.signalRService.hubConnection.off('AddNewcomer');
    this.signalRService.hubConnection.on(
      'AddNewcomer',
      async (newcomerConnectionId: string, chatId: any) => {
        if (!this.videoChatService.isChatMatch(chatId)) {
          this.signalRService.sendRejection(chatId, 'Use is in call');
          return;
        }
        this.signalRService.callWasConfirmed(chatId);
        await this.createRTCPeerConnection(chatId, newcomerConnectionId);
      }
    );

    this.signalRService.hubConnection.off('RegisterOffer');
    this.signalRService.hubConnection.on(
      'RegisterOffer',
      async (chatId, offer, fromClientHubId) => {
        this.signalRService.callWasConfirmed(chatId);
        this.createRTCPeerConnection(chatId, fromClientHubId, offer);
      }
    );

    this.signalRService.hubConnection.off('RegisterAnswer');
    this.signalRService.hubConnection.on(
      'RegisterAnswer',
      async (answer, userConnectionId) => {
        await this.registerAnswer(
          this._linkedPeerConnections.get(userConnectionId)!,
          answer,
          userConnectionId
        );
      }
    );

    this.signalRService.hubConnection.off('HandleNewCandidate');
    this.signalRService.hubConnection.on(
      'HandleNewCandidate',
      async (candidate, userConnectionId) => {
        let cand = new RTCIceCandidate(candidate);
        const peerConnection =
          this._linkedPeerConnections.get(userConnectionId);
        peerConnection!.addIceCandidate(cand).catch((e) => console.log(e));
      }
    );
  }

  async createRTCPeerConnection(
    chatId: number,
    fromClientConnectionId: string,
    offer = null
  ) {
    const peerConnection = new RTCPeerConnection(configuration);
    this._linkedPeerConnections.set(fromClientConnectionId, peerConnection);

    peerConnection.onicecandidate = async (event) => {
      await this.onIceCandidate(event, peerConnection, fromClientConnectionId);
    };

    peerConnection.onnegotiationneeded = this.onNegotiationNeeded;
    peerConnection.onconnectionstatechange = this.onConnectionStateChange;

    await this.createMediaController(peerConnection);

    if (offer != null) {
      this.mapNewRTCPeerConnection(
        peerConnection,
        fromClientConnectionId,
        offer
      );
    } else {
      this.createNewRTCPeerConnection(
        chatId,
        peerConnection,
        fromClientConnectionId
      );
    }
  }

  async mapNewRTCPeerConnection(
    peerConnection: RTCPeerConnection,
    FromClientHubId: string,
    offer: any
  ) {
    const remoteDesc = new RTCSessionDescription(offer);
    await peerConnection.setRemoteDescription(remoteDesc);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    this.signalRService.hubConnection.invoke(
      'SendAnswer',
      answer,
      FromClientHubId
    );
  }

  async createNewRTCPeerConnection(
    chatId: number,
    peerConnection: RTCPeerConnection,
    FromClientHubId: string
  ) {
    const offer = await peerConnection.createOffer(options);
    await peerConnection.setLocalDescription(offer);
    this.signalRService.hubConnection?.invoke(
      'SendOffer',
      chatId,
      offer,
      FromClientHubId
    );
  }

  async createMediaController(peerConnection: RTCPeerConnection | any) {
    let audioStream: any = null;

    if (!this.mediaConstraints.audio && !this.mediaConstraints.video) {
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      audioStream?.getTracks()?.forEach((track: any) => {
        track.enabled = false;
        peerConnection.addTrack(track, audioStream);
      });
    } else {
      audioStream = await navigator.mediaDevices.getUserMedia(
        this.mediaConstraints
      );
      audioStream?.getTracks()?.forEach((track: any) => {
        peerConnection.addTrack(track, audioStream);
      });
    }

    this.stream = audioStream;

    peerConnection.ontrack = (event: any) => {
      this.remoteAudio = event.streams[0];
    };
    //this.selfAudio = audioStream;
  }

  onConnectionStateChange = (event: any) => {
    if (event?.currentTarget?.connectionState == 'disconnected') {
      this.clientDisconnected.emit();
    }
  };
  onNegotiationNeeded = (event: any) => {
    // if (peerConnection.connectionState === 'connected') {
    //   console.log('connected');
    //   console.log(peerConnection);
    // }
  };
  onIceCandidate = async (
    event: any,
    peerConnection: RTCPeerConnection,
    fromClientHubId: string
  ) => {
    event.currentTarget;
    if (event.candidate) {
      this.signalRService.hubConnection?.invoke(
        'fireCandidate',
        event.candidate,
        fromClientHubId
      );
    }
  };
  async registerAnswer(
    peerConnection: RTCPeerConnection,
    answer: any,
    fromClientConnectionId: string
  ) {
    const remoteDesc = new RTCSessionDescription(answer);
    await peerConnection.setRemoteDescription(remoteDesc);
  }

  endChat() {
    this._linkedPeerConnections.forEach((e) => {
      e.close();
    });
    this.stream?.getTracks()?.forEach((t: any) => t.stop());
  }

  changeMicroStatus(isEnabled: boolean) {
    this.stream?.getTracks()?.forEach((t: any) => {
      if (t.kind == 'audio') t.enabled = isEnabled;
    });
  }

  changeVideoStatus(isEnabled: boolean) {
    this.stream?.getTracks()?.forEach((t: any) => {
      if (t.kind == 'video') t.enabled = isEnabled;
    });
  }
}
