import { Injectable } from '@angular/core'
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr'
import { Message } from '@chat/shared/models/entities/message.model'
import { DataService } from '@chat/shared/services/dataService'
import { ContactService } from '@chat/shared/services/contactService'
import { MessageCto } from '@chat/shared/models/dto/messageCto'
import { VideoChatService } from '@modules/video-chat/services/video-chat.service'
import { ToastrService } from 'ngx-toastr'
import { FileApiService } from '@chat/shared/api/file-api.service'
import { WebRtcSignalingGateway } from '@modules/video-chat/services/webrtc-signaling.gateway'
import { IOfferEvent } from '@modules/video-chat/interfaces/offer-event.interface'
import { IAnswerEvent } from '@modules/video-chat/interfaces/answer-event.interface'
import { ICandidateEvent } from '@modules/video-chat/interfaces/candidate-event.interface'
import { IParticipantInfo } from '@modules/video-chat/interfaces/participant-info.interface'
import { Subject } from 'rxjs'

const SendCallRequest = 'SendCallRequest'
const DisconnectFromChat = 'DisconnectFromChat'
const SendRejection = 'Reject'
const UpdateMediaStatus = 'UpdateMediaStatus'

const IncomeCall = 'HandleIncomeCall'
const DisconnectUser = 'HandleDisconnection'
const HandleRejection = 'HandleRejection'
const RemoteMediaStatusChanged = 'RemoteMediaStatusChanged'

@Injectable({
  providedIn: 'root',
})
export class SignalRService implements WebRtcSignalingGateway {
  public hubConnection: HubConnection
  public user: any
  private timer: any
  public readonly chatTimeOut: number = 45000

  public selfConnectionId: string | null = null

  public onNewParticipant$ = new Subject<IParticipantInfo>()
  public onExistingParticipants$ = new Subject<IParticipantInfo>()
  public onParticipantLeft$ = new Subject<{
    connectionId: string
    userId: number
  }>()
  public onOffer$ = new Subject<IOfferEvent>()
  public onAnswer$ = new Subject<IAnswerEvent>()
  public onCandidate$ = new Subject<ICandidateEvent>()

  constructor(
    private dataService: DataService,
    private videoChatService: VideoChatService,
    private contactService: ContactService,
    private toastr: ToastrService,
    private fileApiService: FileApiService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.connect()
  }

  public connect() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('chatSignalR')
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .then(() => {
        this.selfConnectionId = (
          this.hubConnection as any
        ).connection.connectionId
        this.join(this.user.id, this.user.role)
        this.addChatListener()
      })
      .catch((err) => console.log('Error while starting connection: ' + err))
  }

  public addChatListener() {
    this.hubConnection.on('GetMessage', (message: Message) => {
      this.dataService.AddMsg(message)
    })

    this.hubConnection.on('Status', (userId: number, status: boolean) => {
      this.dataService.SetStatus(userId, status)
      this.contactService.SetStatus(userId, status)
    })

    this.hubConnection.on('RemovedMessage', (chatId: any, msgId: any) => {
      this.dataService.RemoveMsg(chatId, msgId)
    })

    this.hubConnection.on(
      'EditedMessage',
      (chatId: any, msgId: any, text: any) => {
        this.dataService.updateMsg(chatId, msgId, text)
      }
    )

    this.hubConnection.on(
      'NewChat',
      (firstId: any, secondId: any, chatId: any) => {
        this.contactService.updateChats(firstId, secondId, chatId)
      }
    )

    this.hubConnection.on(IncomeCall, (chatId: number) => {
      this.setEndChatTimer(chatId, this.chatTimeOut)
      if (!this.videoChatService.NotifyIncomeCall(chatId)) {
        this.sendRejection(chatId, 'unable to connect')
      }
    })

    this.hubConnection.on(DisconnectUser, (chatId: number, userId: number) => {
      this.videoChatService.DisconnectUser(chatId, userId)
    })

    this.hubConnection.on(
      HandleRejection,
      (chatId: number, message: string) => {
        if (this.videoChatService.currentChatId == chatId) {
          this.reject(message)
          this.videoChatService.endCall(chatId)
        }
      }
    )

    this.hubConnection.on(
      RemoteMediaStatusChanged,
      (
        chatId: number,
        userId: number,
        deviceType: 'microphone' | 'camera',
        newStatus: boolean
      ) => {
        if (
          this.user.id !== userId &&
          this.videoChatService.isChatMatch(chatId)
        ) {
          if (deviceType === 'microphone') {
            this.videoChatService.updateRemoteMicStatus(newStatus)
          } else if (deviceType === 'camera') {
            this.videoChatService.updateRemoteCameraStatus(newStatus)
          }
        }
      }
    )

    this.hubConnection.on('GroupCallStarted', (groupChatId: number) => {
      this.dataService.setGroupCallState(groupChatId, true)
    })

    this.hubConnection.on('GroupCallEnded', (groupChatId: number) => {
      this.dataService.setGroupCallState(groupChatId, false)
      this.videoChatService.handleGroupCallEnded(groupChatId)
    })

    this.hubConnection.on(
      'ExistingParticipantsInGroupCall',
      (groupChatId: number, participants: IParticipantInfo) => {
        this.onExistingParticipants$.next(participants)
      }
    )

    this.hubConnection.on(
      'NewParticipantInGroupCall',
      (groupChatId: number, participantInfo: IParticipantInfo) => {
        this.onNewParticipant$.next(participantInfo)
      }
    )

    this.hubConnection.on(
      'ParticipantLeftGroupCall',
      (groupChatId: number, connectionId: string, userId: number) => {
        this.onParticipantLeft$.next({ connectionId, userId })
      }
    )

    this.hubConnection.on(
      'ReceiveGroupOffer',
      (fromConnectionId: string, offer: any) => {
        this.onOffer$.next({ fromConnectionId, offer })
      }
    )

    this.hubConnection.on(
      'ReceiveGroupAnswer',
      (fromConnectionId: string, answer: any) => {
        this.onAnswer$.next({ fromConnectionId, answer })
      }
    )

    this.hubConnection.on(
      'ReceiveGroupIceCandidate',
      (fromConnectionId: string, candidate: any) => {
        this.onCandidate$.next({ fromConnectionId, candidate })
      }
    )
  }

  public addChat(firstId: number, secondId: number, chatId: number) {
    return this.hubConnection.invoke('AddChat', firstId, secondId, chatId)
  }

  public updateGroupMessage(id: number, text: string, chatId: number) {
    return this.hubConnection.invoke('UpdateGroupMessage', id, text, chatId)
  }

  public updateChatMessage(id: number, text: string, chatId: number) {
    return this.hubConnection.invoke('UpdateChatMessage', id, text, chatId)
  }

  public sendMessage(msg: MessageCto) {
    return this.hubConnection.invoke(
      'SendMessage',
      this.user.id,
      JSON.stringify(msg)
    )
  }

  public sendGroupMessage(msg: MessageCto) {
    return this.hubConnection.invoke(
      'SendGroupMessage',
      this.user.id,
      this.user.role,
      JSON.stringify(msg)
    )
  }

  public sendRejection(chatId: number, message: string): Promise<void> {
    return this.hubConnection.invoke(SendRejection, chatId, message)
  }

  public sendCallRequest(chatId: number): Promise<void> {
    this.setEndChatTimer(chatId, this.chatTimeOut)
    this.videoChatService.SetActiveCall(chatId)
    return this.hubConnection.invoke(SendCallRequest, this.user.id, chatId)
  }

  public disconnectFromCall(chatId: any): Promise<void> {
    this.callWasConfirmed(chatId)
    return this.hubConnection.invoke(DisconnectFromChat, this.user.id, chatId)
  }

  public setVoiceChatConnection(chatId: any): Promise<void> {
    return this.hubConnection.invoke(
      'SetVoiceChatConnection',
      chatId,
      this.user.id
    )
  }

  public reject(message: string) {
    this.toastr.error(message)
  }

  public async setEndChatTimer(chatId: any, ms: number) {
    this.clearTimer()
    this.timer = setTimeout(async () => {
      this.videoChatService.endCall(chatId)
      await this.disconnectFromCall(chatId)
    }, ms)

    this.callWasConfirmed = (localChatId: any) => {
      if (chatId == localChatId) {
        this.clearTimer()
      }
    }
  }

  private clearTimer() {
    try {
      clearTimeout(this.timer)
    } catch {}
  }

  public callWasConfirmed = (chatId: any) => {}

  public sendMediaStatusUpdate(
    chatId: number,
    deviceType: 'microphone' | 'camera',
    newStatus: boolean
  ) {
    if (this.hubConnection?.state === 'Connected') {
      return this.hubConnection.invoke(
        UpdateMediaStatus,
        chatId,
        deviceType,
        newStatus
      )
    }
    return Promise.resolve()
  }

  public SendGroupFiles(files) {
    const k = 1024
    const dm = 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const formData = new FormData()
    for (var item of files) {
      var i = Math.floor(Math.log(item.size) / Math.log(k))
      var msg = new MessageCto()
      msg.userId = this.user.id
      msg.chatId = this.dataService.activChatId
      msg.fileSize =
        parseFloat((item.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
      msg.fileContent = item.name
      if (item.name.includes('.jpg') || item.name.includes('.png')) {
        msg.isimage = true
      } else msg.isfile = true
      formData.append(item.name, item)
    }
    formData.append('ChatId', this.dataService.activChatId.toString())
    this.fileApiService
      .uploadFile(formData)
      .subscribe((result) => this.sendGroupMessage(msg))
  }

  public remove(id: any) {
    if (this.dataService.isGroupChat)
      return this.hubConnection.invoke(
        'DeleteGroupMsg',
        id.toString(),
        this.dataService.activChatId.toString()
      )
    else
      return this.hubConnection.invoke(
        'DeleteChatMsg',
        id.toString(),
        this.dataService.activChatId.toString()
      )
  }

  public join(userId: number, role: string) {
    return this.hubConnection.invoke('Join', userId, role)
  }

  public startGroupCall(groupChatId: number): Promise<void> {
    return this.hubConnection.invoke('StartGroupCall', groupChatId)
  }

  public endGroupCall(groupChatId: number): Promise<void> {
    return this.hubConnection.invoke('EndGroupCall', groupChatId)
  }

  public joinGroupCall(groupChatId: number): Promise<void> {
    return this.hubConnection.invoke('JoinGroupCall', groupChatId)
  }

  public leaveGroupCall(groupChatId: number): Promise<void> {
    return this.hubConnection.invoke('LeaveGroupCall', groupChatId)
  }

  public sendOffer(targetConnectionId: string, offer: any): Promise<void> {
    return this.hubConnection.invoke(
      'SendGroupOffer',
      targetConnectionId,
      offer
    )
  }

  public sendAnswer(targetConnectionId: string, answer: any): Promise<void> {
    return this.hubConnection.invoke(
      'SendGroupAnswer',
      targetConnectionId,
      answer
    )
  }

  public sendCandidate(
    targetConnectionId: string,
    candidate: any
  ): Promise<void> {
    return this.hubConnection.invoke(
      'SendGroupIceCandidate',
      targetConnectionId,
      candidate
    )
  }
}
