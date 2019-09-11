import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TestAvailable} from '../models/test-available.model';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) {
  }

  getTestAllTestBySubjectId(subjectId: string): Observable<TestAvailable[]> {
    return this.http.get<TestAvailable[]>('/Tests/GetTests?subjectId=3');
  }

  getTestTestById(id: string): Observable<TestAvailable> {
    return this.http.get<TestAvailable>('/Tests/GetTest?id=' + id);
  }

  deleteTest(id: string): Observable<void> {
    return this.http.delete<void>('/Tests/DeleteTest?id=' + id);
  }
}
