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

}
