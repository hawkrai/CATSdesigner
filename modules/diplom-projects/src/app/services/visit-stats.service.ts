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
    return this.http.get('api/DiplomProjectConsultation', {
      params: new HttpParams({ fromObject: params }),
    })
  }

  public getJoinedLector(
    subjectId: string,
    loadSelf: boolean = false
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

  public getLecturerDiplomGroups(params: any): Observable<any> {
    return this.http.get('api/DpCorrelation', {
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
    return this.http.post('api/DiplomProjectConsultation', {
      StudentId: studentId,
      ConsultationDateId: consultationDateId,
      Mark: mark,
      Comment: comment,
      ShowForStudent: isShow,
    })
  }

  public editMark(
    id: string,
    studentId: string,
    consultationDateId: string,
    mark: string,
    comment: string,
    isShow: boolean
  ): Observable<any> {
    return this.http.post('api/DiplomProjectConsultation', {
      Id: id,
      StudentId: studentId,
      ConsultationDateId: consultationDateId,
      Mark: mark,
      Comment: comment,
      ShowForStudent: isShow,
    })
  }

  public addDate(
    date: string,
    startTime: string,
    endTime: string,
    audience: string,
    building: string
  ): Observable<any> {
    return this.http.post('api/DiplomProjectConsultationDate', {
      Day: date,
      StartTime: startTime,
      EndTime: endTime,
      Building: building,
      Audience: audience,
    })
  }

  public deleteDate(id: string): Observable<any> {
    return this.http.post('api/DiplomProjectConsultationDate/' + id, null)
  }
}
