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
  // iceServers: [{ urls: 'stun:numb.viagenie.ca:3478' }],
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
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
};

const options = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

let iceCount = 0;
let iceCountLocal = 0;

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
  public selfMedia: any;

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
    //this.signalRService.hubConnection.off('AddNewcomer');
    //this.signalRService.hubConnection.off('RegisterOffer');
    //this.signalRService.hubConnection.off('HandleNewCandidate');
    this.endChat();
  }

  ngOnInit(): void {
    this.mediaConstraints.audio = this.isMicroActive;
    this.mediaConstraints.video = this.isVideoActive;
    iceCount = 0;
    iceCountLocal = 0;
    var peer = new RTCPeerConnection(configuration);

    this.signalRService.hubConnection.off('AddNewcomer');
    this.signalRService.hubConnection.on(
      'AddNewcomer',
      async (newcomerConnectionId: string, chatId: any) => {
        console.log('New call', newcomerConnectionId, chatId);
        if (!this.videoChatService.isChatMatch(chatId)) {
          this.signalRService.sendRejection(chatId, 'Use is in call');
          return;
        }
        this.signalRService.callWasConfirmed(chatId);
        await this.createRTCPeerConnectionPeer(peer, chatId, newcomerConnectionId);
      }
    );

    this.signalRService.hubConnection.off('RegisterOffer');
    this.signalRService.hubConnection.on(
      'RegisterOffer',
      async (chatId, offer, fromClientHubId) => {
        console.log('New offer', fromClientHubId, chatId);
        console.log(offer);
        this.signalRService.callWasConfirmed(chatId);
        this.createRTCPeerConnectionPeer(peer, chatId, fromClientHubId, offer);
      }
    );

    this.signalRService.hubConnection.off('RegisterAnswer');
    this.signalRService.hubConnection.on(
      'RegisterAnswer',
      async (answer, userConnectionId) => {
        console.log('New answer', userConnectionId);
        console.log(answer);
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
        // console.log('HandleNewCandidate', ++iceCount);
        //console.log(candidate);
        let cand = new RTCIceCandidate(candidate);
        //console.log('web rtc candidate');
        //console.log(cand);
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
    await this.createRTCPeerConnectionPeer(new RTCPeerConnection(configuration), chatId, fromClientConnectionId, offer);
  }
  async createRTCPeerConnectionPeer(
    peerConnection: RTCPeerConnection,
    chatId: number,
    fromClientConnectionId: string,
    offer = null
  ) {

    this._linkedPeerConnections.set(fromClientConnectionId, peerConnection);

    peerConnection.onicecandidate = async (event) => {
      //console.log(`candidate: ${++iceCountLocal}`);
      //console.log(event.candidate);
      //if (event.candidate == null) return;
      await this.onIceCandidate(event, peerConnection, fromClientConnectionId);
    };

    peerConnection.onnegotiationneeded = async (event: any) => {
      console.log('neg needed');
      console.log(event);
      const offer = await peerConnection.createOffer(options);
      await peerConnection.setLocalDescription(offer);
      this.signalRService.hubConnection?.invoke(
        'SendOffer',
        chatId,
        offer,
        fromClientConnectionId
      );
    };
    peerConnection.onconnectionstatechange = (event: any) => {
      console.log('State Changed');
      console.log(event?.currentTarget?.connectionState);

      if (event?.currentTarget?.connectionState === "failed") {
        console.log("!! Connection failed !!");
        (peerConnection as any).restartIce();
      }

      if (event?.currentTarget?.connectionState == 'disconnected') {
        this.clientDisconnected.emit();
      }
    };
    peerConnection.oniceconnectionstatechange = (e) => {
      console.log('ICE State Changed');
      console.log(peerConnection.iceConnectionState);

      if (peerConnection.iceConnectionState === "failed") {
        console.log("!! Connection failed !!");
        (peerConnection as any).restartIce();
      }

    };

    await this.createMediaController(peerConnection);

    if (offer != null) {
      this.mapNewRTCPeerConnection(
        peerConnection,
        fromClientConnectionId,
        offer
      );
    } else {
      // this.createNewRTCPeerConnection(
      //   chatId,
      //   peerConnection,
      //   fromClientConnectionId
      // );
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
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
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
    this.selfMedia = audioStream;
  }

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
