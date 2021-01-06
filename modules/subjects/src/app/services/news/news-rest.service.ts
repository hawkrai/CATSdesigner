import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";
import { News } from 'src/app/models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsRestService {

  constructor(private http: HttpClient) { }

  public getAllNews(subjectId: number): Observable<News[]> {
    return this.http.get('Services/News/NewsService.svc/GetNews/' + subjectId).pipe(
      map(res => res['News'])
    );
  }

  public saveNews(news: any): Observable<any> {
    return this.http.post('Services/News/NewsService.svc/Save', {...news });
  }

  public disableNews(subjectId: number): Observable<any> {
    return this.http.post('Services/News/NewsService.svc/DisableNews', {subjectId});
  }

  public enableNews(subjectId: number): Observable<any> {
    return this.http.post('Services/News/NewsService.svc/EnableNews', {subjectId});
  }

  public deleteNews(id: number, subjectId: number): Observable<any> {
    return this.http.post('Services/News/NewsService.svc/Delete', {id, subjectId});
  }
}
