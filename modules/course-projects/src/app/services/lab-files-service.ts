import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabFilesService {

  constructor(private http: HttpClient) { }

  public getCourseProjectFilesForUser(params: any): Observable<any> {
    return this.http.get('Services/Labs/LabsService.svc/GetFilesLab', {params: new HttpParams({fromObject: params})});
  }

  public getCourseProjectFiles(params: any): Observable<any> {
    return this.http.get('Services/Labs/LabsService.svc/GetFilesV2', {params: new HttpParams({fromObject: params})});
  }
}
