import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  public uploadFile(file) {
    const uploadData = new FormData();
    uploadData.append('files[]', file, file.name);
    return this.http.post('api/Upload', uploadData);
  }

  public getAttachment(params: any): Observable<any> {
    return this.http.get('api/Upload', {params: new HttpParams({fromObject: params})});
  }

  public getSubjectFile(params: any): Observable<any> {
    return this.http.get<any>('Subject/GetFileSubjectV2', {params: new HttpParams({ fromObject: params })}).pipe(
      map(response => response.Attachment)
    );
  }
  
  public deleteFile(deleteUrl: string): Observable<any> {
    return this.http.delete(deleteUrl);
  }
}
