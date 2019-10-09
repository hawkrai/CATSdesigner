import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TestAvailable} from '../models/test-available.model';
import {Group} from "../models/group.model";
import {SubGroup} from "../models/sub-group.model";
import {TestAvailabilityRequest} from "../models/testAvailabilityRequest.model";
import {Question} from "../models/question/question.model";


@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) {
  }

  getTestAllTestBySubjectId(subjectId: string): Observable<TestAvailable[]> {
    return this.http.get<TestAvailable[]>('/Tests/GetTests?subjectId=3');
  }

  getQuestionsByTest(testId: string): Observable<Question[]> {
    return this.http.get<Question[]>('/Tests/GetQuestions?testId=' + testId);
  }

  getQuestion(testId: string): Observable<Question> {
    return this.http.get<Question>('/Tests/GetQuestion?id=' + testId);
  }

  getTestTestById(id: string): Observable<TestAvailable> {
    return this.http.get<TestAvailable>('/Tests/GetTest?id=' + id);
  }

  getGroupsBySubjectId(id: string): Observable<Group[]> {
    return this.http.get<Group[]>('/Tests/GetGroups?subjectId=' + id);
  }

  getSubGroupsBySubjectIdGroupIdTestId(subjectId: string, testId: string, groupId: number): Observable<SubGroup[]> {
    return this.http.get<SubGroup[]>('/Tests/GetSubGroups?groupId=' + groupId + '&subjectId=' + subjectId + '&testId=' + testId);
  }

  deleteTest(id: string): Observable<void> {
    return this.http.delete<void>('/Tests/DeleteTest?id=' + id);
  }

  changeAvailabilityForStudent(data: TestAvailabilityRequest): Observable<void> {
    return this.http.post<void>('/Tests/ChangeLockForUserForStudent', data);
  }

  changeAvailabilityForAllStudents(data: TestAvailabilityRequest): Observable<void> {
    return this.http.post<void>('/Tests/UnlockTests', data);
  }

  deleteQuestion(id: any): Observable<void> {
    return this.http.delete<void>('/Tests/DeleteQuestion?id=' + id);
  }
}
