import { Component, OnInit } from '@angular/core';

const configuration = {
  configuration: {
    offerToReceiveAudio: true,
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
  styleUrls: ['./stream-handler.component.less']
})
export class StreamHandlerComponent implements OnInit {
  private _linkedPeerConnections: Map<string, RTCPeerConnection> = new Map();
  private _hubConnection?: any;

  public mediaConstraints = {
    audio: true,
    video: true,
  };

  public remoteAudio: any;
  public selfAudio: any;

  public stream: any;

  constructor() {}

  ngOnInit(): void {
    this._hubConnection
      .start()
      .then(() => {
        console.log('connection started');
      })
      .catch((err) => console.log(err));

    this._hubConnection.onclose(() => {
      setTimeout(() => {
        this._hubConnection
          ?.start()
          .then(() => {
            console.log('connection started');
          })
          .catch((err) => console.log(err));
      }, 5000);
    });

    this._hubConnection.on(
      'AddNewcomer',
      async (newcomerConnectionId: string, userName: string) => {
        console.log('add newcomer');
        console.log(newcomerConnectionId);
        console.log(userName);
        console.log('------------------');
        await this.createRTCPeerConnection(newcomerConnectionId);
      }
    );

    this._hubConnection.on('RegisterOffer', async (offer, fromClientHubId) => {
      console.log('RegisterOffer');
      console.log(fromClientHubId);
      console.log(offer);
      console.log('------------------');
      this.createRTCPeerConnection(fromClientHubId, offer);
    });

    this._hubConnection?.on(
      'RegisterAnswer',
      async (answer, userConnectionId) => {
        console.log('RegisterAnswer');
        console.log(answer);
        console.log(userConnectionId);
        console.log('------------------');
        await this.registerAnswer(
          this._linkedPeerConnections.get(userConnectionId)!,
          answer,
          userConnectionId
        );
      }
    );

    this._hubConnection?.on(
      'HandleNewCandidate',
      async (candidate, userConnectionId) => {
        let cand = new RTCIceCandidate(candidate);
        console.log(candidate);
        const peerConnection =
          this._linkedPeerConnections.get(userConnectionId);
        console.log(peerConnection);
        peerConnection!.addIceCandidate(cand).catch((e) => console.log(e));
      }
    );
  }

  onClick() {
    console.log('clicked');
    let user = prompt('enter the userName');
    console.log(user);
    this._hubConnection?.send('SetVoiceChatConnection', 1, user, {});
  }

  async createRTCPeerConnection(fromClientConnectionId: string, offer = null) {
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
      this.createNewRTCPeerConnection(peerConnection, fromClientConnectionId);
    }
  }

  async mapNewRTCPeerConnection(
    peerConnection: RTCPeerConnection,
    FromClientHubId: string,
    offer: any
  ) {
    const remoteDesc = new RTCSessionDescription(offer);
    await peerConnection.setRemoteDescription(remoteDesc);
    //await this.createMediaController(peerConnection);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    await this._hubConnection?.send('SendAnswer', answer, FromClientHubId);
  }

  async createNewRTCPeerConnection(
    peerConnection: RTCPeerConnection,
    FromClientHubId: string
  ) {
    const offer = await peerConnection.createOffer(options);
    await peerConnection.setLocalDescription(offer);
    console.log('offer');
    console.log(offer);
    this._hubConnection?.send('SendOffer', offer, FromClientHubId);
  }

  async createMediaController(peerConnection: RTCPeerConnection | any) {
    let audioStream: any = null;

    if (!this.mediaConstraints.audio && !this.mediaConstraints.video) {
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioStream
        .getVideoTracks()
        .forEach((track: any) => (track.enabled = !track.enabled));
      audioStream
        ?.getTracks()
        ?.forEach((track: any) => {
          track.enabled = false;
          return peerConnection.addTrack(track, audioStream);
        });
    } else {
      audioStream = await navigator.mediaDevices.getUserMedia(
        this.mediaConstraints
      );
      audioStream
      ?.getTracks()
      ?.forEach((track: any) => {peerConnection.addTrack(track, audioStream); console.log("track",track);});
    }

    this.stream = audioStream;


    peerConnection.ontrack = (event: any) => {
      this.remoteAudio = event.streams[0];
    };
    //this.selfAudio = audioStream;
  }

  onConnectionStateChange = (event: any) => {
    //if (peerConnection.connectionState === 'connected') {
    console.log('onConnectionStateChange');
    console.log(event);
    console.log(`event?.currentTarget?.connectionState`, event?.currentTarget?.connectionState)
    console.log(`event?.target?.connectionState`, event?.target?.connectionState)
    if(event?.currentTarget?.connectionState == "disconnected"){
      //this.endChat();
      this.stream
      ?.getTracks()
      ?.forEach((t:any) => t.stop())
    }
    //}
  };
  onNegotiationNeeded = (event: any) => {
    console.log('onNegotiationNeeded event');
    console.log(event);
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
    console.log('candidate event');
    console.log(event);
    event.currentTarget;
    if (event.candidate) {
      this._hubConnection?.send(
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

  endChat(){
    this._linkedPeerConnections.forEach(e => {
      e.close();
    })
    this.stream
    ?.getTracks()
    ?.forEach((t:any) => t.stop())
  }
  changeMicroStatus(){
    this.stream
    ?.getTracks()
    ?.forEach((t:any) => t.enabled = !t.enabled)
  }
}
