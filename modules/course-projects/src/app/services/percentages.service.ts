import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PercentagesService {
  constructor(private http: HttpClient) {}

  public getPercentages(params: any): Observable<any> {
    return this.http.get('api/CpPercentage', {
      params: new HttpParams({ fromObject: params }),
    })
  }

  public editStage(
    id: string,
    date: string,
    subjectId: string,
    name: string,
    percentage: number
  ): Observable<any> {
    return this.http.post('api/CpPercentage', {
      Id: id,
      Date: date,
      SubjectId: subjectId,
      Name: name,
      Percentage: percentage,
    })
  }

  public deleteStage(id: string): Observable<any> {
    return this.http.post('api/CpPercentage/' + id, null)
  }
}
