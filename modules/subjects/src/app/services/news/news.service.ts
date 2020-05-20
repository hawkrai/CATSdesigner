import {Injectable} from '@angular/core';
import {IAppState} from '../../store/state/app.state';
import {Store, select} from '@ngrx/store';
import {NewsRestService} from './news-rest.service';
import {CreateNews, DeleteNewsById, LoadNews, UpdateNews} from '../../store/actions/news.actions';
import {Observable} from 'rxjs';
import {News} from '../../models/news.model';
import {getNews} from '../../store/selectors/news.selectors';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private store$: Store<IAppState>,
              private rest: NewsRestService) {
  }

  loadDate() {
    this.store$.dispatch(new LoadNews())
  }

  getAllNews(): Observable<News[]> {
    return this.store$.pipe(select(getNews));
  }

  createNews(newNews: News) {
    this.rest.saveNews(newNews).subscribe(
      (res) => res.Code === '200' && this.store$.dispatch(new CreateNews(newNews))
    );
  }

  updateNews(newNews: News) {
    this.rest.saveNews(newNews).subscribe(
      (res) => res.Code === '200' && this.store$.dispatch(new UpdateNews(newNews))
    );
  }

  deleteNews(newsId: string, subjectId: string) {
    this.rest.deleteNews(newsId, subjectId).subscribe(
      (res) => res.Code === '200' && this.store$.dispatch(new DeleteNewsById(newsId))
    );
  }

  disableAllNews(subjectId: string) {
    this.rest.disableNews(subjectId).subscribe(
      (res) => res.Code === '200' && this.loadDate()
    );
  }

  enableAllNews(subjectId: string) {
    this.rest.enableNews(subjectId).subscribe(
      (res) => res.Code === '200' && this.loadDate()
    );
  }

  public lol(subjectId: string): Observable<any> {
    return this.rest.lol(subjectId);
  }
}
