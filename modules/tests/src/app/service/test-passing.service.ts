import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TestDescription} from "../models/test-description.model";
import {Result} from "../models/result.model";
import {UserAnswers} from "../models/user-answers.model";
import {ControlItems} from "../models/control-items.model";
import {Test} from "../models/test.model";
import {TestQuestion} from "../models/question/test-question.model";
import {Results} from "../models/results.model";


@Injectable({
  providedIn: "root"
})
export class TestPassingService {

  constructor(private http: HttpClient) {
  }

  getTestDescription(testId: string): Observable<TestDescription> {
    return this.http.get<TestDescription>("/TestPassing/GetTestDescription?testId=" + testId);
  }

  getAvailableTests(subjectId: string): Observable<Test[]> {
    return this.http.get<Test[]>("/TestPassing/getAvailableTests?subjectId=" + subjectId);
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

  getResultsByGroupAndSubject(groupId: string, subjectId: string = "3"): Observable<Result[]> {
    return this.http.get<Result[]>("/TestPassing/GetResults?groupId=" + groupId + "&subjectId=" + subjectId);
  }

  getResultsByGroupsAndSubject(groupsIds: string[], subjectId: string): Observable<Results[]> {
    return this.http.post<Results[]>("/TestPassing/GetResults", {groupsIds, subjectId});
  }

  getAnswersByStudentAndTest(studentId: string, testId: string = "3"): Observable<UserAnswers[]> {
    return this.http.get<UserAnswers[]>("/TestPassing/GetUserAnswers?studentId=" + studentId + "&testId=" + testId);
  }

  getControlItems(subjectId: string): Observable<ControlItems[]> {
    return this.http.get<ControlItems[]>("/TestPassing/GetControlItems?subjectId=" + subjectId);
  }

  getAnswersForEndedTest(testID: number, userId: number): Observable<ControlItems[]> {
    return this.http.get<ControlItems[]>("/TestPassing/GetAnswersForEndedTest?testId=" + testID + "&userId=" + userId);
  }
}
