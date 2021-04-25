import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProjectThemeService {

  constructor(private http: HttpClient) {
  }

  public getThemes(params: any): Observable<any> {
    return this.http.get('api/dpcorrelation', {params: new HttpParams({fromObject: params})});
  }

}
