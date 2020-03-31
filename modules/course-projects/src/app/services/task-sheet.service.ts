import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TaskSheetService {

  constructor(private http: HttpClient) {
  }

  public getTaskSheet(params: any): Observable<any> {
    return this.http.get('Cp/GetTasksSheetHtml',
      {params: new HttpParams({fromObject: params}), responseType: 'text'});
  }

}
