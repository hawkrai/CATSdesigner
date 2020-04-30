import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {ENewsActions, LoadNews, SetNews} from "../actions/news.actions";
import {map, switchMap, withLatestFrom} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {IAppState} from "../state/app.state";
import {getSubjectId} from "../selectors/subject.selector";
import {NewsRestService} from "../../services/news/news-rest.service";
import {News} from "../../models/news.model";


@Injectable()
export class NewsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: NewsRestService
  ) {
  }

  @Effect()
  getNews$ = this.actions$.pipe(
    ofType<LoadNews>(ENewsActions.LOAD_NEWS),
    withLatestFrom(this.store.pipe(select(getSubjectId))),
    switchMap(([_, subjectId]) => this.rest.getAllNews(subjectId)),
    map((news: News[]) => {
      return new SetNews(news)
    })
  );
}
