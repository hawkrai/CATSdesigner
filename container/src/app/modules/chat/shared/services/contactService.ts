import { Injectable } from '@angular/core'
import { Chat } from '@chat/shared/models/entities/chats.model'
import { BehaviorSubject, Observable } from 'rxjs'
import { DataService } from '@chat/shared/services/dataService'
import { ChatCto } from '@chat/shared/models/dto/chatCto'
import { SubjectGroups } from '@chat/shared/models/entities/subject.groups.model'
import { NgZone } from '@angular/core'
import { ChatApiService } from '@chat/shared/api/chat-api.service'

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  public user: any
  public isLecturer: boolean
  public contacts: BehaviorSubject<Chat[]> = new BehaviorSubject<Array<Chat>>(
    []
  )
  public openChatComand: BehaviorSubject<Chat> = new BehaviorSubject<Chat>(null)
  public isChatOpen: boolean
  public hasMoreLecturers: boolean = true
  public hasMoreSecondaryContacts: boolean = true
  public loadingMore: boolean = false
  public loadingStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  )
  private lecturersOffset: number = 0
  private secondaryContactsOffset: number = 0
  private readonly pageSize: number = 20
  private currentFilter: string = ''
  private loadingTimer: any = null

  constructor(
    private chatApiService: ChatApiService,
    private dataService: DataService,
    private zone: NgZone
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.isLecturer = this.user.role == 'lector'
  }

  public openChat(chat: Chat) {
    if (chat.id) {
      this.zone.run(() => {
        this.isChatOpen = true
        this.openChatComand.next(chat)
      })
      return
    }

    const existing = this.dataService.chats
      .getValue()
      .find((c) => c.userId === chat.userId)

    if (existing) {
      chat.id = existing.id
      this.zone.run(() => {
        this.isChatOpen = true
        this.openChatComand.next(chat)
      })
      return
    }

    this.zone.run(() => {
      this.isChatOpen = true
      this.openChatComand.next(chat)
    })
  }

  public CreateChat(userId: number) {
    var chatCto = new ChatCto(userId, this.user.id)
    return this.chatApiService.createChat(chatCto)
  }

  public updateChats(fUserId, sUserId, chatId) {
    if (this.user && this.user.id == sUserId) {
      var contact = this.contacts.getValue().find((x) => x.userId == fUserId)
      if (contact) {
        contact.id = chatId
        this.dataService.updateOrAddChat(contact, chatId)
      }
    }
  }

  public SetStatus(id: number, isOnline: boolean): void {
    var contacts = this.contacts.getValue()
    var contactNum = contacts.findIndex((x) => x.userId == id)
    if (contactNum > -1) {
      contacts[contactNum].isOnline = isOnline
      this.contacts.next(contacts)
    }
  }

  private resetContactState() {
    this.contacts.next([])
    this.lecturersOffset = 0
    this.secondaryContactsOffset = 0
    this.hasMoreLecturers = true
    this.hasMoreSecondaryContacts = true
    this.setLoadingState(false)
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer)
      this.loadingTimer = null
    }
  }

  public loadContacts(filter: string) {
    if (this.currentFilter !== filter) {
      this.resetContactState()
      this.currentFilter = filter
    }

    if (this.loadingMore) {
      if (this.loadingTimer) {
        clearTimeout(this.loadingTimer)
      }

      this.loadingTimer = setTimeout(() => {
        this.loadContacts(filter)
      }, 500)

      return
    }

    this.contacts.next([])

    if (this.isLecturer) {
      this.loadLecturers(filter)
    } else {
      this.loadStudentLecturers(filter)
    }
  }

  private loadLecturers(filter: string) {
    if (this.loadingMore || !this.hasMoreLecturers) {
      this.updateLoadingState()
      return
    }
    this.setLoadingState(true)
    var contacts = this.contacts.getValue()

    const loadingTimeout = setTimeout(() => {
      if (this.loadingMore) {
        this.setLoadingState(false)
      }
    }, 5000)

    this.chatApiService
      .getAllLecturers(filter, this.pageSize, this.lecturersOffset)
      .subscribe({
        next: (res) => {
          clearTimeout(loadingTimeout)
          if (res.length < this.pageSize) {
            this.hasMoreLecturers = false
            this.updateLoadingState()
          }

          if (res.length === 0 && this.lecturersOffset === 0) {
            this.hasMoreLecturers = false

            if (this.isLecturer) {
              if (this.hasMoreSecondaryContacts) {
                this.loadLecturerStudents(filter, contacts)
              } else {
                this.contacts.next(contacts)
                this.setLoadingState(false)
              }
            } else {
              this.updateLoadingState()
              this.contacts.next(contacts)
              this.setLoadingState(false)
            }
            return
          }

          res.forEach((element) => {
            if (element.userId != this.user.id) {
              var chat = new Chat()
              chat.name = element.fullName
              chat.profilePicture = element.profile
              chat.userId = element.userId
              chat.isOnline = element.isOnline
              contacts.push(chat)
            }
          })

          this.lecturersOffset += res.length

          if (this.hasMoreSecondaryContacts) {
            this.loadLecturerStudents(filter, contacts)
          } else {
            this.contacts.next(contacts)
            this.setLoadingState(false)
          }
        },
        error: (err) => {
          clearTimeout(loadingTimeout)
          this.setLoadingState(false)
        },
      })
  }

  private loadLecturerStudents(filter: string, contacts: Chat[]) {
    if (!this.hasMoreSecondaryContacts) {
      this.contacts.next(contacts)
      this.setLoadingState(false)
      return
    }

    this.setLoadingState(true)

    const loadingTimeout = setTimeout(() => {
      if (this.loadingMore) {
        this.setLoadingState(false)
      }
    }, 5000)

    this.chatApiService
      .getLecturerStudents(
        this.user.id,
        filter,
        this.pageSize,
        this.secondaryContactsOffset
      )
      .subscribe({
        next: (res) => {
          clearTimeout(loadingTimeout)

          if (res.length < this.pageSize) {
            this.hasMoreSecondaryContacts = false
            this.updateLoadingState()
          }

          if (res.length === 0 && this.secondaryContactsOffset === 0) {
            this.hasMoreSecondaryContacts = false
            this.updateLoadingState()

            if (contacts.length === 0) {
              this.setLoadingState(false)
            }
          }

          res.forEach((element) => {
            if (element.userId != this.user.id) {
              var chat = new Chat()
              chat.name = element.fullName
              chat.groupId = element.groupId
              chat.profilePicture = element.profile
              chat.userId = element.userId
              chat.isOnline = element.isOnline
              contacts.push(chat)
            }
          })

          this.secondaryContactsOffset += res.length

          this.contacts.next(contacts)
          this.setLoadingState(false)
        },
        error: (err) => {
          clearTimeout(loadingTimeout)
          this.setLoadingState(false)
        },
      })
  }

  private loadStudentLecturers(filter: string) {
    if (!this.hasMoreSecondaryContacts) {
      this.setLoadingState(false)
      return
    }

    this.setLoadingState(true)

    const loadingTimeout = setTimeout(() => {
      if (this.loadingMore) {
        this.setLoadingState(false)
      }
    }, 5000)

    this.chatApiService
      .getStudentLecturers(
        this.user.id,
        filter,
        this.pageSize,
        this.secondaryContactsOffset
      )
      .subscribe({
        next: (res) => {
          clearTimeout(loadingTimeout)
          var contacts = this.contacts.getValue()

          if (res.length < this.pageSize) {
            this.hasMoreSecondaryContacts = false
            this.updateLoadingState()
          }

          if (res.length === 0 && this.secondaryContactsOffset === 0) {
            this.hasMoreSecondaryContacts = false
            this.updateLoadingState()
            this.setLoadingState(false)
          }

          res.forEach((element) => {
            if (element.userId != this.user.id) {
              var chat = new Chat()
              chat.name = element.fullName
              chat.profilePicture = element.profile
              chat.userId = element.userId
              chat.isOnline = element.isOnline
              contacts.push(chat)
            }
          })

          this.secondaryContactsOffset += res.length

          this.contacts.next(contacts)
          this.setLoadingState(false)
        },
        error: (err) => {
          clearTimeout(loadingTimeout)
          this.setLoadingState(false)
        },
      })
  }

  public loadMoreContacts() {
    if (this.isLecturer) {
      if (!this.hasMoreLecturers && !this.hasMoreSecondaryContacts) {
        this.setLoadingState(false)
        return
      }
    } else {
      if (!this.hasMoreSecondaryContacts) {
        this.setLoadingState(false)
        return
      }
    }

    if (this.loadingMore) return

    if (this.isLecturer) {
      if (this.hasMoreLecturers) {
        this.loadLecturers(this.currentFilter)
      } else if (this.hasMoreSecondaryContacts) {
        const currentContacts = this.contacts.getValue()
        this.loadLecturerStudents(this.currentFilter, currentContacts)
      } else {
        this.setLoadingState(false)
      }
    } else {
      if (this.hasMoreSecondaryContacts) {
        this.loadStudentLecturers(this.currentFilter)
      } else {
        this.setLoadingState(false)
      }
    }
  }

  public loadGroups(): Observable<SubjectGroups[]> {
    return this.chatApiService.getAllGroups(this.user.id, this.user.role)
  }

  private updateLoadingState() {
    if (this.isLecturer) {
      if (!this.hasMoreLecturers && !this.hasMoreSecondaryContacts) {
        this.setLoadingState(false)
      }
    } else {
      if (!this.hasMoreSecondaryContacts) {
        this.setLoadingState(false)
      }
    }
  }

  private setLoadingState(isLoading: boolean): void {
    this.zone.run(() => {
      this.loadingMore = isLoading
      this.loadingStatus.next(isLoading)
    })
  }
}
