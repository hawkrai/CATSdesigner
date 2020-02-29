import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {ENewsActions, GetNews, SaveNews, SetNews} from "../actions/news.actions";
import {exhaust, map, mergeMap, mergeMapTo, switchAll, switchMap, withLatestFrom} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {IAppState} from "../state/app.state";
import {getSubjectId} from "../selectors/subject.selector";
import {NewsService} from "../../services/news.service";
import {News} from "../../models/news.model";
import {getNews} from "../selectors/news.selectors";
import {of} from "rxjs";


@Injectable()
export class NewsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private newsService: NewsService
  ) {
  }

  @Effect()
  getNews$ = this.actions$.pipe(
    ofType<GetNews>(ENewsActions.GetNews),
    mergeMap(() => this.store.pipe(select(getSubjectId))),
    switchMap((subjectId: string) => this.newsService.getAllNews(subjectId)),
    switchMap((news: News[]) => {
      this.store.dispatch(new SetNews(news));
      return of(new GetNews());
    })
  );

  // @Effect()
  // saveNews$ = this.actions$.pipe(
  //   ofType<SaveNews>(ENewsActions.SaveNews),
  //   map(action => action.payload),
  //   switchMap((news: News) => this.newsService.saveNews(news)),
  //   map(() => this.store.pipe(select(getSubjectId))),
  //   exhaust(),
  //   switchMap((subjectId: string) => this.newsService.getAllNews(subjectId)),
  //   switchMap((news: News[]) => {
  //     this.store.dispatch(new SetNews(news));
  //     return this.store.pipe(select(getNews));
  //   })
  // );
}
