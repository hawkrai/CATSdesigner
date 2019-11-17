import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TestAvailable} from '../models/test-available.model';
import {TestDescription} from '../models/test-description.model';
import {TestQuestion} from '../models/question/test-question.model';
import {Result} from "../models/result.model";
import {UserAnswers} from "../models/user-answers.model";
import {ControlItems} from "../models/control-items.model";


@Injectable({
  providedIn: 'root'
})
export class TestPassingService {

  constructor(private http: HttpClient) {
  }

  getTestDescription(testId: string): Observable<TestDescription> {
    return this.http.get<TestDescription>('/TestPassing/GetTestDescription?testId=' + testId);
  }

  getAvailableTests(): Observable<TestAvailable[]> {
    return this.http.get<TestAvailable[]>('/TestPassing/getAvailableTests?subjectId=3');
  }

  getNextQuestion(testId: string, questionNumber: string): Observable<TestQuestion> {
    return this.http.get<TestQuestion>('/TestPassing/GetNextQuestionJson?testId=' + testId + '&questionNumber=' + questionNumber + '&userId=10031');
  }

  getStudentResults(subjectId: string): Observable<TestAvailable[]> {
    return this.http.get<TestAvailable[]>('/TestPassing/GetStudentResults?subjectId=' + subjectId);
  }

  answerQuestionAndGetNext(answer: any): Observable<any> {
    return this.http.post<any>('TestPassing/AnswerQuestionAndGetNext', answer);
  }

  getResultsByGroupAndSubject(groupId: string, subjectId: string = "3"): Observable<Result[]> {
    return this.http.get<Result[]>('TestPassing/GetResults?groupId=' + groupId + '&subjectId=3');
  }

  getAnswersByStudentAndTest(studentId: string, testId: string = "3"): Observable<UserAnswers[]> {
    return this.http.get<UserAnswers[]>('/TestPassing/GetUserAnswers?studentId=10041&testId=' + testId);
  }

  getControlItems(subjectId: string): Observable<ControlItems[]> {
    return this.http.get<ControlItems[]>('/TestPassing/GetControlItems?subjectId=3');
  }
}
