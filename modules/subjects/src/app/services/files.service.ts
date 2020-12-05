import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';

import { Attachment } from './../models/file/attachment.model';
import { AttachedFile } from '../models/file/attached-file.model';

@Injectable({ providedIn: 'root' })
export class FilesService {

  constructor(private http: HttpClient) { }

  public uploadFile(file: File): Observable<AttachedFile> {
    const uploadData = new FormData();
    uploadData.append('files[]', file, file.name);
    return this.http.post<AttachedFile>('api/Upload', uploadData).pipe(
      map(files => files[0])
    );
  }

  public getAttachments(params: { values: string, deleteValues: string }): Observable<AttachedFile[]> {
    return this.http.get<AttachedFile[]>('api/Upload', {params: new HttpParams({fromObject: params})});
  }

  public getSubjectFiles(subjectId: number): Observable<Attachment[]> {
    const params = new HttpParams();
    params.append('subjectId', subjectId.toString());
    return this.http.get<any>('Subject/GetFileSubjectV2', { params }).pipe(
      map(response => response.Attachment)
    );
  }
  
  public deleteFile(deleteUrl: string): Observable<any> {
    return this.http.delete(deleteUrl);
  }

}
