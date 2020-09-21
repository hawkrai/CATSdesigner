import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VisitStatsService {

  constructor(private http: HttpClient) {
  }

  public getVisitStats(params: any): Observable<any> {
    return this.http.get('api/CourseProjectConsultation', {params: new HttpParams({fromObject: params})});
  }

  public setMark(studentId: string, consultationDateId: string, mark: string, comment: string): Observable<any> {
    return this.http.post('api/CourseProjectConsultation',
      {StudentId: studentId, ConsultationDateId: consultationDateId, Mark: mark, Comment: comment});
  }

  public editMark(id: string, studentId: string, consultationDateId: string, mark: string, comment: string): Observable<any> {
    return this.http.post('api/CourseProjectConsultation',
      {Id: id, StudentId: studentId, ConsultationDateId: consultationDateId, Mark: mark, Comment: comment});
  }

  public addDate(date: string, subjectId: string): Observable<any> {
    return this.http.post('api/CourseProjectConsultationDate', {Day: date, SubjectId: subjectId});
  }

  public deleteDate(params: any): Observable<any> {
    return this.http.delete('api/CourseProjectConsultationDate', {params: new HttpParams({fromObject: params})});
  }

}
