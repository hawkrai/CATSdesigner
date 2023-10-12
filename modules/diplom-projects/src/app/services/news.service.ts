import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  public getAllNews(subjectId: string): Observable<any> {
    return this.http.get('api/CourseProjectNews/' + subjectId)
  }
}
