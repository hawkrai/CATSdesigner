import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PercentagesService {

    constructor(private http: HttpClient) { }

    public getPercentages(params: any): Observable<any> {
        return this.http.get('api/CpPercentage', { params: new HttpParams({ fromObject: params }) });
    }

}
