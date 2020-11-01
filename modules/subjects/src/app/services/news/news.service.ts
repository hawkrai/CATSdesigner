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

  loadData() {
    this.store$.dispatch(new LoadNews())
  }

  getAllNews(): Observable<News[]> {
    return this.store$.pipe(select(getNews));
  }

  createNews(newNews: News) {
    this.rest.saveNews(newNews).subscribe(
      (res) => res.Code === '200' && this.loadData()
    );
  }

  updateNews(newNews: News) {
    this.rest.saveNews(newNews).subscribe(
      (res) => res.Code === '200' && this.loadData()
    );
  }

  deleteNews(newsId: string, subjectId: number) {
    this.rest.deleteNews(newsId, subjectId).subscribe(
      (res) => res.Code === '200' && this.store$.dispatch(new DeleteNewsById(newsId))
    );
  }

  disableAllNews(subjectId: number) {
    this.rest.disableNews(subjectId).subscribe(
      (res) => res.Code === '200' && this.loadData()
    );
  }

  enableAllNews(subjectId: number) {
    this.rest.enableNews(subjectId).subscribe(
      (res) => res.Code === '200' && this.loadData()
    );
  }
}
