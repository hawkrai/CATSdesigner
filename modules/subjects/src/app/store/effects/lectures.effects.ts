import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {LecturesRestService} from '../../services/lectures/lectures-rest.service';
import {ELecturesActions, LoadLecturesCalendar, SetLecturesCalendar} from '../actions/lectures.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {getSubjectId} from '../selectors/subject.selector';
import {Calendar} from '../../models/calendar.model';

@Injectable()
export class LecturesEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: LecturesRestService) {
  }

  @Effect()
  getCalendar$ = this.actions$.pipe(
    ofType<LoadLecturesCalendar>(ELecturesActions.LOAD_LECTURE_CALENDAR),
    withLatestFrom(this.store.pipe(select(getSubjectId))),
    switchMap(([_, subjectId]) => this.rest.getCalendar(subjectId)),
    map((calendar: Calendar[]) => {
      return new SetLecturesCalendar(calendar)
    })
  );
}
