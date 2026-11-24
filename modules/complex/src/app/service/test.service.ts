import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Question } from '../models/question/Question'
import { UserAnswer } from '../models/question/UserAnswer'
import { DataValue } from '../models/data-value.model'
import { TestResultDataKey } from '../models/test-result-data-key.enum'
import { Test } from '../models/Test'
import { TestQuestion } from '../models/question/TestQuestion'
import { TestResult } from '../models/TestResult'

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private http: HttpClient) {}

  getQuestionsByTest(testId: string): Observable<Question[]> {
    return this.http.get<Question[]>('/Tests/GetQuestions?testId=' + testId)
  }

  getQuestion(testId: string): Observable<Question> {
    return this.http.get<Question>('/Tests/GetQuestion?id=' + testId)
  }

  getTestById(id: string): Observable<Test> {
    return this.http.get<Test>('/Tests/GetTest?id=' + id)
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

  closeTestAndGetResult(testId: string): Observable<TestResult> {
    return this.http
      .get<{ Data: DataValue[] }>(
        '/TestPassing/CloseTestAndGetResult?testId=' + testId
      )
      .pipe(
        map((res) => {
          const data = res && res.Data
          const result = new TestResult()
          result.answers =
            this.getDataValue<UserAnswer[]>(data, TestResultDataKey.Answers) ||
            []
          result.mark = this.getDataValue<number>(data, TestResultDataKey.Mark)
          result.percent = this.getDataValue<number>(
            data,
            TestResultDataKey.Percent
          )
          result.startTime = this.parseServerDate(
            this.getDataValue<string>(data, TestResultDataKey.StartTime)
          )
          result.endTime = this.parseServerDate(
            this.getDataValue<string>(data, TestResultDataKey.EndTime)
          )
          return result
        })
      )
  }

  getEndedTestResult(testId: string): Observable<TestResult> {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    return this.http
      .get<DataValue[]>(
        '/TestPassing/GetUserAnswers?studentId=' + user.id + '&testId=' + testId
      )
      .pipe(
        map((res) => {
          const result = new TestResult()
          result.answers =
            this.getDataValue<UserAnswer[]>(
              res,
              TestResultDataKey.UserAnswers
            ) || []
          const info = this.getDataValue<any>(res, TestResultDataKey.TestInfo)
          if (info) {
            result.mark = info.Points
            result.percent = info.Percent
            result.startTime = this.parseServerDate(info.StartTime)
            result.endTime = this.parseServerDate(info.EndTime)
          }
          return result
        })
      )
  }

  private parseServerDate(value: string): Date {
    if (!value) {
      return null
    }
    const match = value.match(/\/Date\((-?\d+)\)\//)
    const date = match ? new Date(parseInt(match[1], 10)) : new Date(value)
    return isNaN(date.getTime()) || date.getFullYear() <= 1 ? null : date
  }

  private getDataValue<T>(data: DataValue[], key: TestResultDataKey): T {
    const item = Array.isArray(data) ? data.find((x) => x.Key === key) : null
    return item ? (item.Value as T) : null
  }

  getTestResult(testId: number, studentId: number): Observable<any> {
    return this.http.get<any>(
      '/TestPassing/GetUserAnswers?studentId=' + studentId + '&testId=' + testId
    )
  }
}
