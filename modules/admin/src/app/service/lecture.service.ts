import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LectureResponse } from '../model/lecture';

@Injectable({
    providedIn: 'root'
})
export class LectureService {

    api = '/Services/Lectures/LecturesService.svc/';

    constructor(private http: HttpClient) {
    }

    getLectures(subjectId: any): Observable<LectureResponse> {
        return this.http.get<LectureResponse>(this.api + '/GetLectures/' + subjectId);
    }
}
