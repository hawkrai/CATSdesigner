import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class VisitStatsService {
  constructor(private http: HttpClient) {}

  public getVisitStats(params: any): Observable<any> {
    return this.http.get('api/CourseProjectConsultation', {
      params: new HttpParams({ fromObject: params }),
    })
  }

  public setMark(
    studentId: string,
    consultationDateId: string,
    mark: string,
    comment: string,
    isShow: boolean
  ): Observable<any> {
    return this.http.post('api/CourseProjectConsultation', {
      StudentId: studentId,
      ConsultationDateId: consultationDateId,
      Mark: mark,
      Comment: comment,
      ShowForStudent: isShow,
    })
  }

  public getJoinedLector(
    subjectId: string,
    loadSelf: boolean = true
  ): Observable<
    {
      LectorId: number
      UserName: string
      FullName: string
    }[]
  > {
    const params = new HttpParams().set('loadSelf', loadSelf + '')
    return this.http
      .get('Services/CoreService.svc/GetJoinedLector/' + subjectId, { params })
      .pipe(map((res) => res['Lectors']))
  }

  public editMark(
    id: string,
    studentId: string,
    consultationDateId: string,
    mark: string,
    comment: string,
    isShow: boolean
  ): Observable<any> {
    return this.http.post('api/CourseProjectConsultation', {
      Id: id,
      StudentId: studentId,
      ConsultationDateId: consultationDateId,
      Mark: mark,
      Comment: comment,
      ShowForStudent: isShow,
    })
  }

  public addDate(
    id: number | null,
    date: string,
    subjectId: string,
    groupId: string,
    startTime: string,
    endTime: string,
    audience: string,
    building: string,
    LecturerId:number| string
  ): Observable<any> {
    return this.http.post('api/CourseProjectConsultationDate', {
      Id:id,
      Day: date,
      SubjectId: subjectId,
      GroupId: groupId,
      StartTime: startTime,
      EndTime: endTime,
      Building: building,
      Audience: audience,
      LecturerId:LecturerId
    })
  }

  public deleteDate(id: string): Observable<any> {
    return this.http.post('api/CourseProjectConsultationDate/' + id, null)
  }
}
