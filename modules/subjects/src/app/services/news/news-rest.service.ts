import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConverterService } from "../converter.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NewsRestService {

  constructor(private http: HttpClient,
              private converterService: ConverterService) { }

  public getAllNews(subjectId: string): Observable<any> {
    return this.http.get('Services/News/NewsService.svc/GetNews/' + subjectId).pipe(
      map(res =>  this.converterService.newsModelsConverter(res['News']))
    );
  }

  public saveNews(news: any): Observable<any> {
    return this.http.post('Services/News/NewsService.svc/Save', {...news});
  }

  public disableNews(subjectId: string): Observable<any> {
    return this.http.post('Services/News/NewsService.svc/DisableNews', {subjectId});
  }

  public enableNews(subjectId: string): Observable<any> {
    return this.http.post('Services/News/NewsService.svc/EnableNews', {subjectId});
  }

  public deleteNews(id: string, subjectId: string): Observable<any> {
    return this.http.post('Services/News/NewsService.svc/Delete', {id, subjectId});
  }
}
