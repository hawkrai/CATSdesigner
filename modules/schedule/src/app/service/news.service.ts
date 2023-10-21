import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { news1 } from '../mock/news-mock'
import { createAction, props } from '@ngrx/store'

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  download(username: string) {
    createAction(
      '[Files] Download Files',
      props<{ pathName: string; fileName: string }>()
    )
  }

  constructor(private http: HttpClient) {}

  getAllNews(username: string): Observable<any> {
    return this.http.post<any>('/Profile/GetNews', { userLogin: username })
  }

  getNewsMock(): Observable<any> {
    const news: any = []
    let i = 0
    while (i < 15) {
      news.push(news1)
      i = i + 1
    }
    return of(news)
  }
}
