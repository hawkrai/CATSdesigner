import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StatisticResponse } from '../model/stats';

@Injectable({
    providedIn: 'root'
})
export class StatisticService {

    api = '/Administration/';

    constructor(private http: HttpClient) {
    }

    getStatistics(userId): Observable<StatisticResponse> {
        return this.http.get<StatisticResponse>(this.api + 'AttendanceJson/' + userId);
    }
}
