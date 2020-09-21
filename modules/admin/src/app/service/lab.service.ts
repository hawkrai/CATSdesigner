import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LabResponse } from '../model/lecture';

@Injectable({
    providedIn: 'root'
})
export class LabService {

    api = '/Services/Labs/LabsService.svc';

    constructor(private http: HttpClient) {
    }

    getLabs(subjectId: any): Observable<LabResponse> {
        return this.http.get<LabResponse>(this.api + '/GetLabs/' + subjectId);
    }
}
