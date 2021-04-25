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
    return this.http.get('api/DpPercentageResult', {params: new HttpParams({fromObject: params})});
  }

  public setPercentage(studentId: string, percentageGraphId: string, mark: string, comment: string, showForStudent: boolean): Observable<any> {
    return this.http.post('api/DpPercentageResult', {StudentId: studentId, PercentageGraphId: percentageGraphId, Mark: mark,
      Comment: comment, ShowForStudent: showForStudent});
  }

  public editPercentage(id: string, studentId: string, percentageGraphId: string, mark: string, comment: string, showForStudent: boolean): Observable<any> {
    return this.http.post('api/DpPercentageResult', {Id: id, StudentId: studentId, PercentageGraphId: percentageGraphId,
      Mark: mark, Comment: comment, ShowForStudent: showForStudent});
  }

  public setMark(assignedProjectId: string, mark: string, lecturerName: string, comment: string, date: string, showForStudent: boolean): Observable<any> {
    return this.http.post('api/DiplomStudentMark', {assignedProjectId, mark, lecturerName, comment, date, showForStudent});
  }
}
