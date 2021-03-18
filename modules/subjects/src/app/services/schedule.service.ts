import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StudentMark } from "../models/student-mark.model";

@Injectable({ providedIn: 'root' })
export class ScheduleService {

    constructor(private http: HttpClient) {}
    
    public deleteLabDateVisit(id: number): Observable<any> {
        return this.http.post('Services/Schedule/ScheduleService.svc/DeleteLabScheduleDate', { id });
    }

    public createLabDateVisit(request: {
        subGroupId: number, date: string, subjectId: number, startTime: string, endTime: string, building: string, audience: string
    }): Observable<any> {
        return this.http.post('Services/Schedule/ScheduleService.svc/SaveDateLab', request);
    }

    public createLectureDateVisit(request: {
        subjectId: number, date: string, startTime: string, endTime: string, building: string, audience: string
      }): Observable<any> {
        return this.http.post('Services/Schedule/ScheduleService.svc/SaveDateLectures', request);
      }
    
    public deleteLectureDateVisit(id: number): Observable<any> {
    return this.http.post('Services/Schedule/ScheduleService.svc/DeleteLectureScheduleDate', { id });
    }

    public deletePracticalDateVisit(id: number): Observable<any> {
        return this.http.post('Services/Schedule/ScheduleService.svc/DeletePracticalScheduleDate', { id });
    }

    public createPracticalDateVisit(request: {
        groupId: number, date: string, subjectId: number, startTime: string, endTime: string, building: string, audience: string
    }): Observable<any> {
        return this.http.post('Services/Schedule/ScheduleService.svc/SaveDatePractical', request);
    }

}