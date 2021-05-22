import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Question } from "../models/question/Question";
import { Test } from "../models/Test";
import { TestQuestion } from "../models/question/TestQuestion";


@Injectable({
  providedIn: "root"
})
export class TestService {

  constructor(private http: HttpClient) {
  }
  
  getPredTest(): Observable<number> {
    const subject = JSON.parse(localStorage.getItem("currentSubject"));
    return this.http.get<number>("/Tests/GetEUMKPredTestIdForSubject?subjectId=" + subject.id);
  }

  getQuestionsByTest(testId: string): Observable<Question[]> {
    return this.http.get<Question[]>("/Tests/GetQuestions?testId=" + testId);
  }

  getQuestion(testId: string): Observable<Question> {
    return this.http.get<Question>("/Tests/GetQuestion?id=" + testId);
  }

  getTestById(id: string): Observable<Test> {
    return this.http.get<Test>("/Tests/GetTest?id=" + id);
  }
  
  getNextQuestion(testId: string, questionNumber: string, excludeCorrectnessIndicator = true): Observable<TestQuestion> {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return this.http.get<TestQuestion>("/TestPassing/GetNextQuestionJson?testId=" + testId + "&questionNumber=" + questionNumber + "&excludeCorrectnessIndicator=" + excludeCorrectnessIndicator + "&userId=" + user.id);
  }

  getStudentResults(subjectId: string): Observable<Test[]> {
    return this.http.get<Test[]>("/TestPassing/GetStudentResults?subjectId=" + subjectId);
  }

  answerQuestionAndGetNext(answer: any): Observable<any> {
    return this.http.post<any>("/TestPassing/AnswerQuestionAndGetNextMobile", answer);
  }  
}
