import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabFilesService {

  constructor(private http: HttpClient) { }

  public getCourseProjectFilesForUser(subjectId: string, userId: string): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/GetFilesLab', {isCoursPrj: true, subjectId, userId});
  }

  public getCourseProjectFiles(params: any): Observable<any> {
    return this.http.get('Services/Labs/LabsService.svc/GetFilesV2', {params: new HttpParams({fromObject: params})});
  }
}
