import {HttpClient, HttpRequest, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FileResponse } from '../model/file';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    api = '/Services/Files/FilesService.svc/';

    constructor(private http: HttpClient) {
    }

    getFiles(): Observable<FileResponse> {
        return this.http.get<FileResponse>(this.api + 'GetFiles/');
    }

    downloadFileFromStorage(filename: string, assignee: string): Observable<any> {
        const headers = new HttpHeaders();
        return this.http.get('/api/file/download/' + filename + '?assignee=' + assignee
            , {
            headers,
            observe: 'response',
            responseType: 'blob'
        }).pipe(catchError(e =>
            throwError(e)
        ));
    }

    pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        const req = new HttpRequest('POST', '/api/file/upload', formData, {
            reportProgress: true,
            responseType: 'blob'
        });
        return this.http.request(req)
            .pipe(catchError(e =>
                throwError(e)));
    }

}
