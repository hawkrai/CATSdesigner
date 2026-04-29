import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PercentagesService {
  constructor(private http: HttpClient) {}

  public getPercentages(params: any): Observable<any> {
    return this.http.get('api/DpPercentage', {
      params: new HttpParams({ fromObject: params }),
    })
  }

  public editStage(
    id: number,
    date: string,
    name: string,
    percentage: number,
    selectedGroupsIds?: number[]
  ): Observable<any> {
    return this.http.post('api/DpPercentage', {
      Id: id,
      Name: name,
      Percentage: percentage,
      Date: date,
      SelectedGroupsIds: selectedGroupsIds,
    })
  }

  public deleteStage(id: number): Observable<any> {
    return this.http.post('api/DpPercentage/' + id, null)
  }
}
