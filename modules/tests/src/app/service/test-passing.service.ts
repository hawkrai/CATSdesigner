import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TestAvailable} from '../models/test-available.model';
import {TestDescription} from '../models/test-description.model';
import {TestQuestion} from '../models/question/test-question.model';


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
}
