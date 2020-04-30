import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadVisitCpService {

  constructor(private http: HttpClient) { }

  public download(params: any): Observable<any> {
    return this.http.get('/Statistic/GetVisitCP',
      {params: new HttpParams({fromObject: params}), responseType: 'blob'});
  }
}
