import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadsServer {

  constructor(private http: HttpClient) { }

  getVisitLabsExcel(subjectId, groupId, subGroupOneId, subGroupTwoId) {
    const params = new HttpParams()
      .set('subjectId', subjectId)
      .set('groupId', groupId)
      .set('subGroupOneId', subGroupOneId)
      .set('subGroupTwoId', subGroupTwoId);
    return this.http.get('Statistic/GetVisitLabs', {params, responseType: 'blob'});
  }

}
