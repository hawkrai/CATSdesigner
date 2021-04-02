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
    return this.http.get('api/DiplomProjectConsultation', {params: new HttpParams({fromObject: params})});
  }

  public setMark(studentId: string, consultationDateId: string, mark: string, comment: string): Observable<any> {
    return this.http.post('api/DiplomProjectConsultation',
      {StudentId: studentId, ConsultationDateId: consultationDateId, Mark: mark, Comment: comment});
  }

  public editMark(id: string, studentId: string, consultationDateId: string, mark: string, comment: string): Observable<any> {
    return this.http.post('api/DiplomProjectConsultation',
      {Id: id, StudentId: studentId, ConsultationDateId: consultationDateId, Mark: mark, Comment: comment});
  }

  public addDate(date: string): Observable<any> {
    return this.http.post('api/DiplomProjectConsultationDate', {Day: date});
  }

  public deleteDate(id: string): Observable<any> {
    return this.http.post('api/DiplomProjectConsultationDate/' + id, null);
  }

}
