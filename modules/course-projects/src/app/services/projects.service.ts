import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ProjectsService {

    constructor(private http: HttpClient) { }

    public getProjects(params: string): Observable<any> {
        return this.http.get('api/courseProject', { params: new HttpParams({ fromString: params }) });
    }

}
