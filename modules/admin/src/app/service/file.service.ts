import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FileResponse} from '../model/file';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    api = '/api/Services/Files/FilesService.svc/';

    constructor(private http: HttpClient) {
    }

    getFiles(): Observable<FileResponse> {
        return this.http.get<FileResponse>(this.api + 'GetFiles/');
    }

    uploadFile(filepath: string, filename: string) {
        location.href = '/api/api/Upload?fileName=' + filepath + '//' + filename;
        // return this.http.get('/api/Upload?fileName=' + filepath + '//' + filename, {
        //     responseType: 'blob'
        // });
    }
}
