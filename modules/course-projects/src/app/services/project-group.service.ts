import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProjectGroupService {
  constructor(private http: HttpClient) {}

  public getGroups(subjectId: string): Observable<any> {
    return this.http.get('api/CourseProjectGroup/' + subjectId)
  }
}
