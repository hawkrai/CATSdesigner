import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CourseUserService {
  constructor(private http: HttpClient) {}

  public getUser(): Observable<any> {
    return this.http.get('api/CourseUser')
  }

  public getUserInfo(id: string): Observable<any> {
    return this.http.get<any>('/Profile/GetProfileInfoById/' + id)
  }
}
