import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { StatisticResponse } from '../model/stats'

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  api = '/Administration/'

  constructor(private http: HttpClient) {}

  getStatistics(userId): Observable<StatisticResponse> {
    return this.http.get<StatisticResponse>(
      this.api + 'AttendanceJson/' + userId
    )
  }

  cutName(name: string): string {
    if (name != null && name.split(' ', 3).length > 2) {
      const splitted = name.split(' ', 3)
      const a = ' ' + splitted[1][0] + '. '
      const b = splitted[2][0] + '. '
      return splitted[0] + a + b
    }
    return name
  }
}
