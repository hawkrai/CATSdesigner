import { Injectable, NgZone } from '@angular/core'
import { Chat } from '@chat/shared/models/entities/chats.model'
import { Message } from '@chat/shared/models/entities/message.model'
import { BehaviorSubject, Observable, from, of, Subject, EMPTY } from 'rxjs'
import { Groups } from '@chat/shared/models/entities/groups.model'
import { finalize, catchError, tap } from 'rxjs/operators'
import { SubjectGroups } from '@chat/shared/models/entities/subject.groups.model'
import { ILoadMessagesResult } from '@chat/shared/models/interfaces/loadMessagesResult.interface'
import { ChatApiService } from '@chat/shared/api/chat-api.service'
import { MessageApiService } from '@chat/shared/api/message-api.service'
import { FileApiService } from '@chat/shared/api/file-api.service'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public files: any[] = []
  public activChat: any
  public activChatId: number
  private _activChatIdSubject = new BehaviorSubject<number | null>(null)
  public activChatId$ = this._activChatIdSubject.asObservable()
  public readMessageGroupCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0)
  public readMessageCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0)
  public readMessageChatCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0)
  public activGroup: Groups
  public activeSubject: SubjectGroups
  public chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Array<Chat>>([])
  public groups: BehaviorSubject<SubjectGroups[]> = new BehaviorSubject<
    Array<SubjectGroups>
  >([])
  public messages: BehaviorSubject<Message[]> = new BehaviorSubject<
    Array<Message>
  >([])
  public searchResults: BehaviorSubject<Message[]> = new BehaviorSubject<
    Array<Message>
  >([])
  private messageOffset: number = 0
  private searchOffset: number = 0
  public isSearching: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  )
  public currentSearchText: string = ''
  public isGroupChat: boolean = false
  public user: any
  public isLecturer: boolean
  public hasMoreMessages: boolean = true
  public hasMoreSearchResults: boolean = true
  public loadingMoreMessages: boolean = false
  public loadingMessagesStatus: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false)
  private loadingTimeout: any = null
  public initialMessagesLoaded = new Subject<void>()
  public readonly defaultPageSize: number = 20
  public readonly searchPageSize: number = 20

  constructor(
    private chatApiService: ChatApiService,
    private messageApiService: MessageApiService,
    private fileApiService: FileApiService,
    private zone: NgZone
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.isLecturer = this.user?.role === 'lector'
  }

  public setActiveChat(chatId: number | null, isGroup: boolean, chatInfo: any) {
    if (this.activChatId !== chatId) {
      this.activChatId = chatId
      this.isGroupChat = isGroup
      this.activChat = chatInfo
      this._activChatIdSubject.next(chatId)
      this.resetMessageState(true)
      if (chatId !== null) {
        this.loadInitialMessages()
      } else {
        this.messages.next([])
        this.searchResults.next([])
      }
    }
  }

  public loadChats(): void {
    this.chatApiService
      .getAllChats(this.user.id)
      .subscribe((result: Chat[]) => {
        var unread = 0
        result.forEach((elem) => {
          if (elem.unread) unread += elem.unread
        })
        this.readMessageChatCount.next(unread)
        this.chats.next(result)
      })
  }

  public loadGroups(): void {
    this.chatApiService
      .getAllGroups(this.user.id, this.user.role)
      .subscribe((result: SubjectGroups[]) => {
        var unread = 0
        result.forEach((elem) => {
          if (elem.unread) unread += elem.unread
          elem.groups.forEach((element) => {
            if (element.unread) unread += element.unread
          })
        })
        this.readMessageGroupCount.next(unread)
        this.groups.next(result)
      })
  }

  public updateRead() {
    if (!this.user?.id || !this.activChatId) return
    this.chatApiService
      .updateReadChat(this.user.id, this.activChatId)
      .subscribe()
  }

  public groupRead() {
    if (!this.user?.id || !this.activChatId) return
    this.chatApiService
      .updateReadGroupChat(this.user.id, this.activChatId)
      .subscribe()
  }

  public SetStatus(id: number, isOnline: boolean): void {
    var chats = this.chats.getValue()
    var chatNum = chats.findIndex((x) => x.userId == id)
    if (chatNum > -1) {
      chats[chatNum].isOnline = isOnline
      this.chats.next([...chats])
    }
  }

  private resetMessageState(clearSearch: boolean = true) {
    this.messageOffset = 0
    this.hasMoreMessages = true
    this.messages.next([])
    this.setLoadingMessagesState(false)
    this.loadingMoreMessages = false

    if (clearSearch) {
      this.searchOffset = 0
      this.hasMoreSearchResults = true
      this.searchResults.next([])
      this.isSearching.next(false)
      this.currentSearchText = ''
    }
  }

  public loadInitialMessages(): void {
    if (
      !this.user?.id ||
      this.activChatId === null ||
      this.activChatId === undefined
    ) {
      this.messages.next([])
      this.setLoadingMessagesState(false)
      return
    }

    this.setLoadingMessagesState(true)

    const apiCall = this.isGroupChat
      ? this.messageApiService.getGroupMessages(
          this.user.id,
          this.activChatId,
          this.defaultPageSize,
          0
        )
      : this.messageApiService.getChatMessages(
          this.user.id,
          this.activChatId,
          this.defaultPageSize,
          0
        )

    apiCall
      .pipe(
        finalize(() => this.setLoadingMessagesState(false)),
        catchError((error) => {
          console.error('Error loading initial messages:', error)
          this.hasMoreMessages = false
          this.messages.next([])
          return EMPTY
        })
      )
      .subscribe((msgs: Message[]) => {
        this.hasMoreMessages = msgs.length === this.defaultPageSize
        this.messages.next([...msgs].reverse())
        this.messageOffset = msgs.length
        this.initialMessagesLoaded.next()
      })
  }

  public loadMoreMessages(): Observable<ILoadMessagesResult> {
    if (
      this.loadingMoreMessages ||
      !this.hasMoreMessages ||
      this.isSearching.getValue() ||
      !this.user?.id ||
      this.activChatId === null ||
      this.activChatId === undefined
    ) {
      return of({ addedCount: 0, totalCount: this.messages.getValue().length })
    }

    this.loadingMoreMessages = true
    this.setLoadingMessagesState(true)

    const apiCall = this.isGroupChat
      ? this.messageApiService.getGroupMessages(
          this.user.id,
          this.activChatId,
          this.defaultPageSize,
          this.messageOffset
        )
      : this.messageApiService.getChatMessages(
          this.user.id,
          this.activChatId,
          this.defaultPageSize,
          this.messageOffset
        )

    return apiCall.pipe(
      tap((msgs: Message[]) => {
        this.hasMoreMessages = msgs.length === this.defaultPageSize
        if (msgs.length > 0) {
          const currentMessages = this.messages.getValue()
          this.messages.next([...msgs.reverse(), ...currentMessages])
          this.messageOffset += msgs.length
        }
      }),
      finalize(() => {
        this.loadingMoreMessages = false
        this.setLoadingMessagesState(false)
      }),
      catchError((error) => {
        console.error('Error loading more messages:', error)
        this.hasMoreMessages = false
        return of([])
      }),
      (source) =>
        new Observable<ILoadMessagesResult>((subscriber) => {
          source.subscribe({
            next: (msgs) =>
              subscriber.next({
                addedCount: msgs.length,
                totalCount: this.messages.getValue().length,
              }),
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete(),
          })
        })
    )
  }

  public searchMessages(searchText: string): void {
    if (
      !this.user?.id ||
      this.activChatId === null ||
      this.activChatId === undefined
    )
      return

    this.currentSearchText = searchText.trim()
    this.resetMessageState(false)
    this.isSearching.next(this.currentSearchText.length > 0)

    if (!this.isSearching.getValue()) {
      this.loadInitialMessages()
      return
    }

    this.setLoadingMessagesState(true)

    this.messageApiService
      .searchMessages(
        this.user.id,
        this.activChatId,
        this.isGroupChat,
        this.currentSearchText,
        this.searchPageSize,
        0
      )
      .pipe(
        finalize(() => this.setLoadingMessagesState(false)),
        catchError((error) => {
          console.error('Error searching messages:', error)
          this.hasMoreSearchResults = false
          this.searchResults.next([])
          return EMPTY
        })
      )
      .subscribe((results: Message[]) => {
        this.hasMoreSearchResults = results.length === this.searchPageSize
        this.searchResults.next([...results].reverse())
        this.searchOffset = results.length
      })
  }

  public loadMoreSearchResults(): Observable<ILoadMessagesResult> {
    if (
      this.loadingMoreMessages ||
      !this.hasMoreSearchResults ||
      !this.isSearching.getValue() ||
      !this.user?.id ||
      this.activChatId === null ||
      this.activChatId === undefined
    ) {
      return of({
        addedCount: 0,
        totalCount: this.searchResults.getValue().length,
      })
    }

    this.loadingMoreMessages = true
    this.setLoadingMessagesState(true)

    const apiCall = this.messageApiService.searchMessages(
      this.user.id,
      this.activChatId,
      this.isGroupChat,
      this.currentSearchText,
      this.searchPageSize,
      this.searchOffset
    )

    return apiCall.pipe(
      tap((results: Message[]) => {
        this.hasMoreSearchResults = results.length === this.searchPageSize
        if (results.length > 0) {
          const currentResults = this.searchResults.getValue()
          this.searchResults.next([...results.reverse(), ...currentResults])
          this.searchOffset += results.length
        }
      }),
      finalize(() => {
        this.loadingMoreMessages = false
        this.setLoadingMessagesState(false)
      }),
      catchError((error) => {
        console.error('Error loading more search results:', error)
        this.hasMoreSearchResults = false
        return of([])
      }),
      (source) =>
        new Observable<ILoadMessagesResult>((subscriber) => {
          source.subscribe({
            next: (results) =>
              subscriber.next({
                addedCount: results.length,
                totalCount: this.searchResults.getValue().length,
              }),
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete(),
          })
        })
    )
  }

  public updateMsg(chatId: number, msgId: number, text: string) {
    if (chatId == this.activChatId) {
      const updateFn = (msg: Message) => {
        if (msg.id === msgId) {
          return { ...msg, text: text }
        }
        return msg
      }
      this.messages.next(this.messages.getValue().map(updateFn))
      this.searchResults.next(this.searchResults.getValue().map(updateFn))
    }
  }

  public AddMsg(msg: Message) {
    if (msg.chatId == this.activChatId) {
      if (!this.isSearching.getValue()) {
        const currentMessages = this.messages.getValue()
        if (!currentMessages.some((m) => m.id === msg.id)) {
          this.messages.next([...currentMessages, msg])
          if (this.isGroupChat) {
            this.groupRead()
          } else {
            this.updateRead()
          }
        }
      }
    } else {
      this.updateUnreadCounters(msg)
    }
  }

  private updateUnreadCounters(msg: Message): void {
    const chatNum = this.getNumChatById(msg.chatId)
    if (chatNum > -1) {
      const chats = this.chats.getValue()
      chats[chatNum].unread = (chats[chatNum].unread || 0) + 1
      chats[chatNum].lastMessage = msg.text
      chats[chatNum].time = msg.time
      this.chats.next([...chats])
      this.readMessageChatCount.next(this.readMessageChatCount.getValue() + 1)
    } else {
      let subjectNum = this.getNumSubjectById(msg.chatId)
      let groupNum = -1
      if (subjectNum === -1) {
        ;[subjectNum, groupNum] = this.getNumGroupById(msg.chatId)
      }

      if (subjectNum > -1) {
        this.readMessageGroupCount.next(
          this.readMessageGroupCount.getValue() + 1
        )
        const subjects = this.groups.getValue()
        const subject = subjects[subjectNum]
        if (groupNum > -1 && subject.groups) {
          subject.groups[groupNum].unread =
            (subject.groups[groupNum].unread || 0) + 1
        } else {
          subject.unread = (subject.unread || 0) + 1
        }
        this.groups.next([...subjects])
      }
    }
  }

  public RemoveMsg(chatId: any, msgId: any) {
    if (chatId == this.activChatId) {
      this.messages.next(this.messages.getValue().filter((m) => m.id != msgId))
      this.searchResults.next(
        this.searchResults.getValue().filter((m) => m.id != msgId)
      )
    }
  }

  public updateOrAddChat(chat: Chat, chatId?: number) {
    if (!chat) return
    if (chatId) {
      chat.id = chatId
    }
    const currentChats = this.chats.getValue()
    const existingChatIndex = currentChats.findIndex(
      (c) => c.id === chat.id || c.userId === chat.userId
    )

    if (existingChatIndex > -1) {
      currentChats[existingChatIndex] = {
        ...currentChats[existingChatIndex],
        ...chat,
      }
      this.chats.next([...currentChats])
    } else if (chat.id) {
      this.chats.next([...currentChats, chat])
    }
  }

  public SendImg(formData: FormData) {
    return this.fileApiService.uploadFile(formData)
  }

  public getNumChatById(id: number): number {
    return this.chats.getValue().findIndex((x) => x.id == id)
  }

  public getNumSubjectById(id: number): number {
    return this.groups.getValue().findIndex((x) => x.id == id)
  }

  public getNumGroupById(id: number): [number, number] {
    const subjects = this.groups.getValue()
    for (let i = 0; i < subjects.length; i++) {
      const num = subjects[i].groups?.findIndex((x) => x.id == id) ?? -1
      if (num > -1) {
        return [i, num]
      }
    }
    return [-1, -1]
  }

  private setLoadingMessagesState(isLoading: boolean): void {
    this.zone.run(() => {
      this.loadingMessagesStatus.next(isLoading)
      if (isLoading && !this.loadingTimeout) {
        this.loadingTimeout = setTimeout(() => {
          if (this.loadingMessagesStatus.getValue()) {
            this.setLoadingMessagesState(false)
            this.loadingMoreMessages = false
          }
        }, 10000)
      } else if (!isLoading && this.loadingTimeout) {
        clearTimeout(this.loadingTimeout)
        this.loadingTimeout = null
      }
    })
  }
}
