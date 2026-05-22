import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Group } from '../models/group.model'
import { SubGroup } from '../models/sub-group.model'
import { TestAvailabilityRequest } from '../models/testAvailabilityRequest.model'
import { Question } from '../models/question/question.model'
import { Test } from '../models/test.model'

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private http: HttpClient) {}

  getAllTestBySubjectId(subjectId: string): Observable<Test[]> {
    return this.http.get<Test[]>('/Tests/GetTests?subjectId=' + subjectId)
  }

  getConcepts(subjectId: string): Observable<any> {
    return this.http.get<any>('/Tests/GetConcepts?subjectId=' + subjectId)
  }

  getEumkRoots(
    subjectId: string
  ): Observable<{ Id: number; Name: string }[]> {
    return this.http
      .get<{ Id: number; Name: string }[]>(
        '/Tests/GetEumkRoots?subjectId=' + subjectId
      )
      .pipe(map((res) => res || []))
  }

  getEumkConceptTree(rootConceptId: number): Observable<any[]> {
    return this.http
      .get<any[]>('/Tests/GetEumkConceptTree?rootConceptId=' + rootConceptId)
      .pipe(map((res) => res || []))
  }

  getConceptRootId(conceptId: number): Observable<number | null> {
    return this.http.get<number | null>(
      '/Tests/GetConceptRootId?conceptId=' + conceptId
    )
  }

  getQuestionsByTest(testId: string): Observable<Question[]> {
    return this.http.get<Question[]>('/Tests/GetQuestions?testId=' + testId)
  }

  getQuestion(testId: string): Observable<Question> {
    return this.http.get<Question>('/Tests/GetQuestion?id=' + testId)
  }

  getTestById(id: string): Observable<Test> {
    const deviceId = this.getOrCreateDeviceId()
    return this.http.get<Test>('/Tests/GetTest?id=' + id + '&deviceId=' + deviceId)
  }

  getGroupsBySubjectId(id: string): Observable<Group[]> {
    return this.http.get<Group[]>('/Tests/GetGroups?subjectId=' + id)
  }

  getSubGroupsBySubjectIdGroupIdTestId(
    subjectId: string,
    testId: string,
    groupId: number
  ): Observable<SubGroup[]> {
    return this.http.get<SubGroup[]>(
      '/Tests/GetSubGroups?groupId=' +
        groupId +
        '&subjectId=' +
        subjectId +
        '&testId=' +
        testId
    )
  }

  deleteTest(id: string): Observable<void> {
    return this.http.post<void>('/Tests/DeleteTest?id=' + id, {})
  }

  changeAvailabilityForStudent(
    data: TestAvailabilityRequest
  ): Observable<void> {
    return this.http.post<void>('/Tests/ChangeLockForUserForStudent', data)
  }

  changeAvailabilityForAllStudents(
    data: TestAvailabilityRequest
  ): Observable<void> {
    return this.http.post<void>('/Tests/UnlockTests', data)
  }

  getFiles(): Observable<any> {
    return this.http.get<any>('/Tests/GetFiles')
  }

  deleteQuestion(id: any): Observable<void> {
    return this.http.post<void>('/Tests/DeleteQuestion?id=' + id, {})
  }

  changeTestOrder(newOrder: any): Observable<void> {
    return this.http.patch<void>('/Tests/OrderTests/', newOrder)
  }

  saveTest(test: Test): Observable<any> {
    return this.http.post<any>('/Tests/SaveTest', test)
  }

  saveQuestion(question: Question): Observable<any> {
    return this.http.post<any>('/Tests/SaveQuestion', question)
  }

  AddQuestionsFromAnotherTest(question: Question): Observable<void> {
    return this.http.post<void>('/Tests/AddQuestionsFromAnotherTest', question)
  }

  getQuestionsFromOtherTest(testId: string): Observable<Question[]> {
    return this.http.get<Question[]>(
      '/Tests/GetQuestionsFromAnotherTests?testId=' + testId
    )
  }

  getTestForLector(): Observable<Test[]> {
    return this.http.get<Test[]>('/Tests/GetTestForLector')
  }

  private getOrCreateDeviceId(): string {
    const key = 'deviceId'
    const existing = localStorage.getItem(key)
    if (existing) return existing

    const generated = this.generateUuid()
    localStorage.setItem(key, generated)
    return generated
  }

  private generateUuid(): string {
    const anyCrypto: any = (globalThis as any).crypto
    if (anyCrypto?.randomUUID) return anyCrypto.randomUUID()

    const bytes = new Uint8Array(16)
    if (anyCrypto?.getRandomValues) {
      anyCrypto.getRandomValues(bytes)
    } else {
      for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256)
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return (
      hex.slice(0, 8) +
      '-' +
      hex.slice(8, 12) +
      '-' +
      hex.slice(12, 16) +
      '-' +
      hex.slice(16, 20) +
      '-' +
      hex.slice(20)
    )
  }
}
