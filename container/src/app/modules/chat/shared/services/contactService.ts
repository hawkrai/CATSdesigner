import { Injectable } from '@angular/core'
import { Chat } from '../models/entities/chats.model'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Message } from '../models/entities/message.model'
import { MsgService } from './msgService'
import { BehaviorSubject, Observable } from 'rxjs'
import { DataService } from './dataService'
import { ChatCto } from '../models/dto/chatCto'
import { User } from '../models/dto/user'
import { SubjectGroups } from '../models/entities/subject.groups.model'
import { NgZone } from '@angular/core'
@Injectable({
  providedIn: 'root',
})
export class ContactService {
  public user: any
  public isLecturer: boolean
  public contacts: BehaviorSubject<Chat[]> = new BehaviorSubject<Array<Chat>>([])
  public openChatComand: BehaviorSubject<Chat> = new BehaviorSubject<Chat>(null)
  public isChatOpen: boolean
  public hasMoreLecturers: boolean = true
  public hasMoreStudents: boolean = true
  public loadingMore: boolean = false
  public loadingStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private lecturersOffset: number = 0
  private studentsOffset: number = 0
  private readonly pageSize: number = 20
  private currentFilter: string = ''
  private loadingTimer: any = null

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private zone: NgZone
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.isLecturer = this.user.role == 'lector'
  }

  public openChat(chat: Chat) {
    this.isChatOpen = true
    this.openChatComand.next(chat)
  }

  public CreateChat(userId: number) {
    var chatCto = new ChatCto(userId, this.user.id)
    return this.http.post<number>('catService/chat/CreateChat', chatCto)
  }

  public updateChats(fUserId, sUserId, chatId) {
    if (this.dataService.user.id == sUserId) {
      var contact = this.contacts.getValue().find((x) => x.userId == fUserId)
      if (contact) {
        contact.id = chatId
        this.dataService.updateChats(contact, chatId)
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
    this.studentsOffset = 0
    this.hasMoreLecturers = true
    this.hasMoreStudents = true
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
      this.loadStudents(filter, [])
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
        console.warn('Lectures loading timeout reached, resetting loading state')
        this.setLoadingState(false)
      }
    }, 5000)
    
    this.http
      .get<Array<User>>(`catService/chat/GetAllLecturers?filter=${filter}&limit=${this.pageSize}&offset=${this.lecturersOffset}`)
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
              if (this.hasMoreStudents) {
                this.loadStudents(filter, contacts)
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
          
          if (this.hasMoreStudents) {
            this.loadStudents(filter, contacts)
          } else {
            this.contacts.next(contacts)
            this.setLoadingState(false)
          }
        },
        error: (err) => {
          clearTimeout(loadingTimeout)
          console.error('Error loading lecturers:', err)
          this.setLoadingState(false)
        }
      })
  }
  
  private loadStudents(filter: string, contacts: Chat[]) {
    if (!this.hasMoreStudents) {
      this.contacts.next(contacts)
      this.setLoadingState(false)
      return
    }

    this.setLoadingState(true)

    const loadingTimeout = setTimeout(() => {
      if (this.loadingMore) {
        console.warn('Students loading timeout reached, resetting loading state')
        this.setLoadingState(false)
      }
    }, 5000)

    this.http
      .get<Array<User>>(`catService/chat/GetAllStudents?filter=${filter}&limit=${this.pageSize}&offset=${this.studentsOffset}`)
      .subscribe({
        next: (res) => {
          clearTimeout(loadingTimeout)

          if (res.length < this.pageSize) {
            this.hasMoreStudents = false
            this.updateLoadingState()
          }

          if (res.length === 0 && this.studentsOffset === 0) {
            this.hasMoreStudents = false
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
          
          this.studentsOffset += res.length
          
          this.contacts.next(contacts)
          this.setLoadingState(false)
        },
        error: (err) => {
          clearTimeout(loadingTimeout)
          console.error('Error loading students:', err)
          this.setLoadingState(false)
        }
      })
  }
  
  public loadMoreContacts() {
    if (this.isLecturer) {
      if (!this.hasMoreLecturers && !this.hasMoreStudents) {
        this.setLoadingState(false)
        return
      }
    } else {
      if (!this.hasMoreStudents) {
        this.setLoadingState(false)
        return
      }
    }

    if (this.loadingMore) return
    
    if (this.isLecturer) {
      if (this.hasMoreLecturers) {
        this.loadLecturers(this.currentFilter)
      } 
      else if (this.hasMoreStudents) {
        const currentContacts = this.contacts.getValue()
        this.loadStudents(this.currentFilter, currentContacts)
      }
      else {
        this.setLoadingState(false)
      }
      
    } else {
      if (this.hasMoreStudents) {
        const currentContacts = this.contacts.getValue()
        this.loadStudents(this.currentFilter, currentContacts)
      } else {
        this.setLoadingState(false)
      }
    }
  }

  public loadGroups(): Observable<SubjectGroups[]> {
    return this.http.get<SubjectGroups[]>(
      'catService/chat/GetAllGroups?userId=' +
        this.user.id +
        '&role=' +
        this.user.role
    )
  }

  private updateLoadingState() {
    if (this.isLecturer) {
      if (!this.hasMoreLecturers && !this.hasMoreStudents) {
        this.setLoadingState(false)
      }
    } else {
      if (!this.hasMoreStudents) {
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
