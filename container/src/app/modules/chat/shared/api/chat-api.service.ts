import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Chat } from '@chat/shared/models/entities/chats.model'
import { SubjectGroups } from '@chat/shared/models/entities/subject.groups.model'
import { User } from '@chat/shared/models/dto/user'
import { ChatCto } from '@chat/shared/models/dto/chatCto'

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  private readonly baseUrl = 'catService/chat'

  constructor(private http: HttpClient) {}

  createChat(chatCto: ChatCto): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/CreateChat`, chatCto)
  }

  getAllChats(userId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.baseUrl}/GetAllChats?userId=${userId}`)
  }

  getChatById(userId: number, chatId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/GetChatById?userId=${userId}&chatId=${chatId}`
    )
  }

  updateReadChat(userId: number, chatId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(
      `${this.baseUrl}/UpdateReadChat?userId=${userId}&chatId=${chatId}`
    )
  }

  updateReadGroupChat(userId: number, chatId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(
      `${this.baseUrl}/UpdateReadGroupChat?userId=${userId}&chatId=${chatId}`
    )
  }

  getAllGroups(userId: number, role: string): Observable<SubjectGroups[]> {
    return this.http.get<SubjectGroups[]>(
      `${this.baseUrl}/GetAllGroups?userId=${userId}&role=${role}`
    )
  }

  getAllLecturers(
    filter: string,
    limit: number,
    offset: number
  ): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/GetAllLecturers?filter=${filter}&limit=${limit}&offset=${offset}`
    )
  }

  getAllStudents(
    filter: string,
    limit: number,
    offset: number
  ): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/GetAllStudents?filter=${filter}&limit=${limit}&offset=${offset}`
    )
  }

  getLecturerStudents(
    lecturerId: number,
    filter: string,
    pageSize,
    offset
  ): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/GetLecturerStudents?lecturerId=${lecturerId}&filter=${filter}&limit=${pageSize}&offset=${offset}`
    )
  }

  getStudentLecturers(
    studentId: number,
    filter: string,
    pageSize: number,
    offset: number
  ): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/GetStudentLecturers?studentId=${studentId}&filter=${filter}&limit=${pageSize}&offset=${offset}`
    )
  }

  getStudentsByGroupId(groupId: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/GetStudentsByGroupId?groupId=${groupId}`
    )
  }

  getUserInfoById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/GetUserInfo?userId=${userId}`)
  }
}
