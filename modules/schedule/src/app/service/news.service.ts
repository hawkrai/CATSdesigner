import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getAllNews(username: string ): Observable<any> {
    return this.http.post<any>('/Profile/GetNews', {userLogin: username});
  }
}
