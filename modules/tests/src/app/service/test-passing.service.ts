import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { TestDescription } from '../models/test-description.model'
import { Result } from '../models/result.model'
import { UserAnswers } from '../models/user-answers.model'
import { ControlItems } from '../models/control-items.model'
import { Test } from '../models/test.model'
import { TestQuestion } from '../models/question/test-question.model'
import { Results } from '../models/results.model'
import { catchError, map, publishLast, refCount, tap } from 'rxjs/operators'
import { CustomEncoder } from '../core/encoder/custom-encoder'
import { FileUtils } from '../utils/file.utils'
import { ClosedTestResult } from '../models/closed-test-result.model'
import { DataValues } from '../models/data-values.model'

class Headers {
  [header: string]: string | string[]
}

@Injectable({
  providedIn: 'root',
})
export class TestPassingService {
  constructor(private http: HttpClient) {}

  getTestDescription(testId: string): Observable<TestDescription> {
    const deviceId = this.getOrCreateDeviceId()
    return this.http.get<TestDescription>(
      '/TestPassing/GetTestDescription?testId=' + testId + '&deviceId=' + deviceId
    )
  }

  downloadExcel(
    groupId,
    subjectId,
    forSelfStudy,
    studentLogins?: string[],
    testIds?: number[]
  ): Observable<Response> {
    let params = new HttpParams()
      .set('groupId', String(groupId))
      .set('subjectId', String(subjectId))
      .set('forSelfStudy', String(forSelfStudy))
    if (studentLogins?.length) {
      params = params.set('studentLogins', studentLogins.join(','))
    }
    if (testIds?.length) {
      params = params.set('testIds', testIds.join(','))
    }
    return this.downloadFile('/TestPassing/GetResultsExcel?' + params.toString()).pipe(
      tap((response: Response) => {
        if (response.headers.get('content-disposition')) {
          FileUtils.downloadFile(response)
        }
      })
    )
  }

  getAvailableTests(subjectId: string): Observable<Test[]> {
    return this.http.get<Test[]>(
      '/TestPassing/getAvailableTests?subjectId=' + subjectId
    )
  }

  getNextQuestion(
    testId: string,
    questionNumber: string,
    excludeCorrectnessIndicator = true
  ): Observable<TestQuestion> {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    return this.http.get<TestQuestion>(
      '/TestPassing/GetNextQuestionJson?testId=' +
        testId +
        '&questionNumber=' +
        questionNumber +
        '&excludeCorrectnessIndicator=' +
        excludeCorrectnessIndicator +
        '&userId=' +
        user.id
    )
  }

  getStudentResults(subjectId: string): Observable<Test[]> {
    return this.http.get<Test[]>(
      '/TestPassing/GetStudentResults?subjectId=' + subjectId
    )
  }

  answerQuestionAndGetNext(answer: any): Observable<any> {
    return this.http.post<any>(
      '/TestPassing/AnswerQuestionAndGetNextMobile',
      answer
    )
  }

  getResultsByGroupAndSubject(
    groupId: string,
    subjectId: string = '3'
  ): Observable<Result[]> {
    return this.http.get<Result[]>(
      '/TestPassing/GetResults?groupId=' + groupId + '&subjectId=' + subjectId
    )
  }

  getResultsByGroupsAndSubject(
    groupsIds: string[],
    subjectId: string
  ): Observable<Results[]> {
    return this.http.post<Results[]>('/TestPassing/GetResults', {
      groupsIds,
      subjectId,
    })
  }

  getAnswersByStudentAndTest(
    studentId: string,
    testId: string
  ): Observable<DataValues[]> {
    return this.http.get<DataValues[]>(
      '/TestPassing/GetUserAnswers?studentId=' + studentId + '&testId=' + testId
    )
  }

  CloseTestAndGetResult(testId): Observable<ClosedTestResult> {
    return this.http.get<ClosedTestResult>(
      '/TestPassing/CloseTestAndGetResult?testId=' + testId
    )
  }

  getControlItems(subjectId: string): Observable<ControlItems[]> {
    return this.http.get<ControlItems[]>(
      '/TestPassing/GetControlItems?subjectId=' + subjectId
    )
  }

  getAnswersForEndedTest(
    testID: number,
    userId: number
  ): Observable<ControlItems[]> {
    return this.http.get<ControlItems[]>(
      '/TestPassing/GetAnswersForEndedTest?testId=' +
        testID +
        '&userId=' +
        userId
    )
  }

  saveNeuralNetwork(data: string, testId: number): Observable<any> {
    return this.http.post<any>('/TestPassing/SaveNeuralNetwork', {
      data,
      testId,
    })
  }

  public downloadFile(url: string): Observable<any> {
    const headers = this.createHeaders()
    return this.http
      .get(url, { headers: headers, observe: 'response', responseType: 'blob' })
      .pipe(
        map((res) => {
          return res
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error)

          return throwError(error)
        }),
        publishLast(),
        refCount()
      )
  }

  private createHeaders(): any {
    const headers: Headers = {}
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    headers['Accept'] = 'application/json, text/javascript, */*; q=0.01'
    return new HttpHeaders(headers)
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
    // modern browsers
    const anyCrypto: any = (globalThis as any).crypto
    if (anyCrypto?.randomUUID) return anyCrypto.randomUUID()

    // fallback (RFC4122 v4-ish)
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
