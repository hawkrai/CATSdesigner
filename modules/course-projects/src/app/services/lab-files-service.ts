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

  public uploadFile(file: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('files[]', file, file.name);
    return this.http.post('api/Upload', uploadData);
  }

  public deleteFile(deleteUrl: string): Observable<any> {
    return this.http.delete(deleteUrl);
  }

  public sendJob(body: any): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/SendFile', body);
  }

  public deleteJob(id: string): Observable<any> {
    return this.http.post('Services/Labs/LabsService.svc/DeleteUserFile', {id});
  }

  public getAttachment(params: any): Observable<any> {
    return this.http.get('api/Upload', {params: new HttpParams({fromObject: params})});
  }
}
