import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PercentageResultsService {

  constructor(private http: HttpClient) {
  }

  public getPercentageResults(params: any): Observable<any> {
    return this.http.get('api/CpPercentageResult', {params: new HttpParams({fromObject: params})});
  }

  public setPercentage(studentId: string, percentageGraphId: string, mark: string, comment: string): Observable<any> {
    return this.http.post('api/CpPercentageResult', {StudentId: studentId, PercentageGraphId: percentageGraphId, Mark: mark,
      Comment: comment});
  }

  public editPercentage(id: string, studentId: string, percentageGraphId: string, mark: string, comment: string): Observable<any> {
    return this.http.post('api/CpPercentageResult', {Id: id, StudentId: studentId, PercentageGraphId: percentageGraphId,
      Mark: mark, Comment: comment});
  }

  public setMark(courseProjectId: string, mark: string): Observable<any> {
    console.log(courseProjectId + ': ' + mark);
    return this.http.post('api/CourseStudentMark', [courseProjectId, mark]);
  }

}
