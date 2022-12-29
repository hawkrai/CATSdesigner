import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FileResponse} from '../model/file';
import { FilesPage } from '../model/filesPage';
import { Attachment } from '../model/lecture';
import { Page } from '../model/page';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    api = '/Administration/';

    constructor(private http: HttpClient) {
    }

    getFiles(): Observable<FileResponse> {
        return this.http.get<FileResponse>(this.api + 'GetFiles/');
    }

    getFilesPaged(pageIndex: number, pageSize: number, filter: string = null, orderBy: string = null, sortDirection: number = 0): Observable<FilesPage<Attachment>> {
        let params = {
            'pageIndex': pageIndex.toString(),
            'pageSize': pageSize.toString()
        }

        if (filter != null && filter.trim() != '') {
            params['filter'] = filter;
        }

        if (orderBy != null && orderBy.trim() != '') {
            params['orderBy'] = orderBy;
            params['sortDirection'] = sortDirection.toString();
        }

        return this.http.get<FilesPage<Attachment>>(this.api + 'GetFilesPagedJsonAsync', {params: params});
    } 

    downloadFile(filepath: string, filename: string) {
        location.href = '/api/Upload?fileName=' + filepath + '//' + filename;
        // return this.http.get('/api/Upload?fileName=' + filepath + '//' + filename, {
        //     responseType: 'blob'
        // });
    }
}
