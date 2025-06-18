import { Injectable, NgZone } from '@angular/core'
import { Chat } from '@chat/shared/models/entities/chats.model'
import { Message } from '@chat/shared/models/entities/message.model'
import { BehaviorSubject, Observable, of, Subject, EMPTY } from 'rxjs'
import { Groups } from '@chat/shared/models/entities/groups.model'
import { finalize, catchError, tap, take, map } from 'rxjs/operators'
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
  public activChat: any = null
  public activChatId: number | null = null
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
  public activeSubjectForGroup: SubjectGroups | null = null
  public chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Array<Chat>>([])
  public groups: BehaviorSubject<SubjectGroups[]> = new BehaviorSubject<
    Array<SubjectGroups>
  >([])
  public showCompletedFilterState = new BehaviorSubject<boolean>(false)
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
  public hasMoreMessages: boolean = false
  public hasMoreSearchResults: boolean = true
  public loadingMoreMessages: boolean = false
  public loadingMessagesStatus: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false)
  private loadingTimeout: any = null
  public initialMessagesLoaded = new Subject<void>()
  public activeChatUpdated = new Subject<void>()
  private activeChatReadTimer: any = null
  public readonly defaultPageSize: number = 20
  public readonly searchPageSize: number = 20
  private readonly readDebounceTime = 1500

  constructor(
    private chatApiService: ChatApiService,
    private messageApiService: MessageApiService,
    private fileApiService: FileApiService,
    private zone: NgZone
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.isLecturer = this.user?.role === 'lector'
  }

  public setActiveChat(
    chatId: number | null,
    isGroup: boolean,
    chatInfo: any,
    parentSubjectInfo: SubjectGroups | null = null
  ) {
    if (this.activChatId !== chatId) {
      if (this.activeChatReadTimer) {
        clearTimeout(this.activeChatReadTimer)
        this.activeChatReadTimer = null
      }
      this.activChatId = chatId
      this.isGroupChat = isGroup
      this.activChat = chatInfo
        ? { ...chatInfo, isCompletedForUser: chatInfo.isCompletedForUser }
        : null
      this.activeSubjectForGroup = parentSubjectInfo
      this._activChatIdSubject.next(chatId)
      this.resetMessageState(true)
      if (chatId !== null) {
        const isSubjectChat = chatInfo && chatInfo.hasOwnProperty('groups')
        const isChatStub =
          isSubjectChat &&
          chatInfo.isCompletedForUser &&
          this.showCompletedFilterState.getValue()
        if (!isChatStub) {
          this.loadInitialMessages()
        } else {
          this.messages.next([])
          this.searchResults.next([])
        }
        localStorage.setItem(
          'activeChat',
          JSON.stringify({
            id: chatId,
            isGroup,
            isCompletedForUser: chatInfo?.isCompletedForUser,
          })
        )
      } else {
        this.messages.next([])
        this.searchResults.next([])
        localStorage.removeItem('activeChat')
      }
    } else {
      if (chatInfo) {
        this.activChat = {
          ...chatInfo,
          isCompletedForUser: chatInfo.isCompletedForUser,
        }
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
    const completed = this.showCompletedFilterState.getValue()
    this.chatApiService
      .getAllGroups(this.user.id, this.user.role, completed)
      .subscribe((result: SubjectGroups[]) => {
        var totalUnreadInActiveOrVisibleCompleted = 0
        result.forEach((subject) => {
          const isSubjectChatStub = completed && subject.isCompletedForUser
          if (subject.unread && !isSubjectChatStub) {
            totalUnreadInActiveOrVisibleCompleted += subject.unread
          }
          subject.groups?.forEach((group) => {
            if (group.unread && !group.isCompletedForUser) {
              totalUnreadInActiveOrVisibleCompleted += group.unread
            }
          })
        })
        this.readMessageGroupCount.next(totalUnreadInActiveOrVisibleCompleted)
        this.groups.next(result)
      })
  }

  public updateRead(): Observable<any> {
    if (!this.user?.id || !this.activChatId) return EMPTY
    const chatIdToUpdate = this.activChatId

    return this.chatApiService
      .updateReadChat(this.user.id, chatIdToUpdate)
      .pipe(
        take(1),
        tap(() => {
          this.zone.run(() => {
            const currentChats = this.chats.getValue()
            const chatIndex = currentChats.findIndex(
              (c) => c.id === chatIdToUpdate
            )
            if (chatIndex > -1) {
              const chat = currentChats[chatIndex]
              const unreadCount = chat.unread || 0
              if (unreadCount > 0) {
                chat.unread = 0
                this.chats.next([...currentChats])

                this.readMessageChatCount.next(
                  Math.max(
                    0,
                    this.readMessageChatCount.getValue() - unreadCount
                  )
                )
              }
            }
          })
        }),
        catchError((error) => {
          console.error(
            `Failed to update read status for chat ${chatIdToUpdate}:`,
            error
          )
          return EMPTY
        })
      )
  }

  public groupRead(): Observable<any> {
    if (!this.user?.id || !this.activChatId) {
      return EMPTY
    }

    const chatIdToUpdate = this.activChatId
    return this.chatApiService
      .updateReadGroupChat(this.user.id, chatIdToUpdate)
      .pipe(
        take(1),
        tap(() => {
          this.zone.run(() => {
            const currentSubjects = this.groups.getValue()
            let unreadCountDecremented = 0
            let updated = false

            for (const subject of currentSubjects) {
              if (subject.id === chatIdToUpdate && subject.unread > 0) {
                unreadCountDecremented = subject.unread
                subject.unread = 0
                updated = true
                break
              }
              if (subject.groups) {
                const groupIndex = subject.groups.findIndex(
                  (g) => g.id === chatIdToUpdate
                )
                if (groupIndex > -1 && subject.groups[groupIndex].unread > 0) {
                  unreadCountDecremented = subject.groups[groupIndex].unread
                  subject.groups[groupIndex].unread = 0
                  updated = true
                  break
                }
              }
            }

            if (updated) {
              this.groups.next([...currentSubjects])
              this.readMessageGroupCount.next(
                Math.max(
                  0,
                  this.readMessageGroupCount.getValue() - unreadCountDecremented
                )
              )
            }
          })
        }),
        catchError((error) => {
          console.error(
            `Failed to update read status for group chat ${chatIdToUpdate}:`,
            error
          )
          return EMPTY
        })
      )
  }

  public markActiveChatAsRead(): void {
    if (!this.activChat || (this.activChat.unread || 0) === 0) {
      return
    }

    if (this.isGroupChat) {
      this.groupRead().subscribe()
    } else {
      this.updateRead().subscribe()
    }
  }

  public SetStatus(id: number, isOnline: boolean): void {
    var chats = this.chats.getValue()
    var chatNum = chats.findIndex((x) => x.userId == id)
    if (chatNum > -1) {
      chats[chatNum].isOnline = isOnline
      this.chats.next([...chats])
    }

    const currentActiveChat = this.activChat
    if (
      currentActiveChat &&
      !this.isGroupChat &&
      currentActiveChat.userId === id
    ) {
      this.activChat = { ...currentActiveChat, isOnline: isOnline }
      this.activeChatUpdated.next()
    }
  }

  private resetMessageState(clearSearch: boolean = true) {
    this.messageOffset = 0
    this.hasMoreMessages = false
    this.messages.next([])
    this.setLoadingMessagesState(false)
    this.loadingMoreMessages = false

    if (clearSearch) {
      this.searchOffset = 0
      this.hasMoreSearchResults = false
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
        map((msgs) => this.convertMessagesTime(msgs)),
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
      this.messageOffset === 0 ||
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
      map((msgs) => this.convertMessagesTime(msgs)),
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
        return of<Message[]>([])
      }),
      map((msgs) => ({
        addedCount: msgs.length,
        totalCount: this.messages.getValue().length,
      }))
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
        map((results) => this.convertMessagesTime(results)),
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
      this.searchOffset === 0 ||
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
      map((results) => this.convertMessagesTime(results)),
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
        return of<Message[]>([])
      }),
      map((results) => ({
        addedCount: results.length,
        totalCount: this.searchResults.getValue().length,
      }))
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
    const messageWithDate = {
      ...msg,
      time: msg.time ? new Date(msg.time) : undefined,
    }

    let isChatCompletedForCurrentUser = false
    if (this.isGroupChat && msg.chatId) {
      const subjects = this.groups.getValue()
      outerLoop: for (const subject of subjects) {
        if (subject.id === msg.chatId) {
          isChatCompletedForCurrentUser = !!subject.isCompletedForUser
          break outerLoop
        }
        if (subject.groups) {
          for (const group of subject.groups) {
            if (group.id === msg.chatId) {
              isChatCompletedForCurrentUser = !!group.isCompletedForUser
              break outerLoop
            }
          }
        }
      }
    }

    if (
      messageWithDate.chatId == this.activChatId &&
      this.activChatId !== null
    ) {
      if (!this.isSearching.getValue()) {
        const currentMessages = this.messages.getValue()
        if (!currentMessages.some((m) => m.id === messageWithDate.id)) {
          this.messages.next([...currentMessages, messageWithDate])
          if (!this.activChat?.isCompletedForUser) {
            this.scheduleActiveChatRead()
          }
        }
      } else {
        if (!this.activChat?.isCompletedForUser) {
          this.scheduleActiveChatRead()
        }
      }
    } else if (!isChatCompletedForCurrentUser) {
      this.updateUnreadCounters(msg)
    }
  }

  private scheduleActiveChatRead(): void {
    if (this.activChat?.isCompletedForUser) {
      if (this.activeChatReadTimer) {
        clearTimeout(this.activeChatReadTimer)
        this.activeChatReadTimer = null
      }
      return
    }

    if (this.activeChatReadTimer) {
      clearTimeout(this.activeChatReadTimer)
    }

    this.activeChatReadTimer = setTimeout(() => {
      if (this.isGroupChat) {
        this.groupRead().subscribe()
      } else {
        this.updateRead().subscribe()
      }
      this.activeChatReadTimer = null
    }, this.readDebounceTime)
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
      return
    }

    let subjectNum = -1
    let groupNum = -1
    let chatToUpdateIsCompletedForUser = false
    let isSubjectLevelChat = false

    const subjects = this.groups.getValue()
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].id === msg.chatId) {
        subjectNum = i
        chatToUpdateIsCompletedForUser = !!subjects[i].isCompletedForUser
        isSubjectLevelChat = true
        break
      }
      const gNum =
        subjects[i].groups?.findIndex((g) => g.id === msg.chatId) ?? -1
      if (gNum > -1) {
        subjectNum = i
        groupNum = gNum
        chatToUpdateIsCompletedForUser =
          !!subjects[i].groups[gNum].isCompletedForUser
        break
      }
    }

    if (chatToUpdateIsCompletedForUser) {
      return
    }

    if (subjectNum > -1) {
      this.readMessageGroupCount.next(this.readMessageGroupCount.getValue() + 1)
      const subjectToUpdate = subjects[subjectNum]
      if (isSubjectLevelChat) {
        subjectToUpdate.unread = (subjectToUpdate.unread || 0) + 1
      } else if (groupNum > -1 && subjectToUpdate.groups) {
        subjectToUpdate.groups[groupNum].unread =
          (subjectToUpdate.groups[groupNum].unread || 0) + 1
      }
      this.groups.next([...subjects])
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

  private convertMessagesTime(messages: Message[]): Message[] {
    return messages.map((msg) => ({
      ...msg,
      time: msg.time ? new Date(msg.time) : undefined,
    }))
  }
}
