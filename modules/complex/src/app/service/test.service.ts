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

  closeTestAndGetAnswers(testId: string): Observable<UserAnswer[]> {
    return this.http
      .get<{ Data: DataValue[] }>(
        '/TestPassing/CloseTestAndGetResult?testId=' + testId
      )
      .pipe(
        map((res) =>
          this.getDataValue<UserAnswer[]>(
            res && res.Data,
            TestResultDataKey.Answers
          )
        )
      )
  }

  getEndedTestAnswers(testId: string): Observable<UserAnswer[]> {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    return this.http
      .get<DataValue[]>(
        '/TestPassing/GetUserAnswers?studentId=' + user.id + '&testId=' + testId
      )
      .pipe(
        map((res) =>
          this.getDataValue<UserAnswer[]>(res, TestResultDataKey.UserAnswers)
        )
      )
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
