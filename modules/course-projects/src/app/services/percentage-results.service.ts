import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PercentageResultsService {

    constructor(private http: HttpClient) { }

    public getPercentageResults(params: any): Observable<any> {
        return this.http.get('api/CpPercentageResult', { params: new HttpParams({ fromObject: params }) });
    }

}
