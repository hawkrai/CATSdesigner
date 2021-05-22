import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Question} from "../models/tests/Question";
import {Test} from "../models/tests/Test";


@Injectable({
  providedIn: "root"
})
export class TestService {

  constructor(private http: HttpClient) {
  }

  getAllTestBySubjectId(subjectId: string): Observable<Test[]> {
    return this.http.get<Test[]>("/Tests/GetTests?subjectId=" + subjectId);
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

}
