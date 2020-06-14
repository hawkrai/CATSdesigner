import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PracticalResponse } from '../model/lecture';

@Injectable({
    providedIn: 'root'
})
export class LabService {

    api = '/api/Services/Practicals/PracticalService.svc';

    constructor(private http: HttpClient) {
    }

    getSubjects(subjectId: any): Observable<PracticalResponse> {
        return this.http.get<PracticalResponse>(this.api + '/GetPracticals/' + subjectId);
    }
}
