import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LecturesService {
  
  constructor(private http: HttpClient) {}

  public getAllLectures(subjectId: string): Observable<any> {
    return this.http.get('Services/Lectures/LecturesService.svc/GetLectures/' + subjectId);
  }

  public getCalendar(subjectId: string): Observable<any> {
    return this.http.get('Services/Lectures/LecturesService.svc/GetCalendar/' + subjectId);
  }
}
