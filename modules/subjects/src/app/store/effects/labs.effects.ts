import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../state/app.state';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {getSubjectId} from '../selectors/subject.selector';
import {LabsRestService} from '../../services/labs/labs-rest.service';
import {ELabsActions, SetLabs, SetLabsCalendar} from '../actions/labs.actions';
import {getCurrentGroup} from '../selectors/groups.selectors';
import {Group} from '../../models/group.model';

@Injectable()
export class LabsEffects {

  constructor(private actions$: Actions,
              private store: Store<IAppState>,
              private rest: LabsRestService) {
  }

  @Effect()
  getProtectionSchedule$ = this.actions$.pipe(
    ofType(ELabsActions.LOAD_LABS, ELabsActions.LOAD_LABS_CALENDAR),
    withLatestFrom(this.store.pipe(select(getSubjectId))),
    withLatestFrom(this.store.pipe(select(getCurrentGroup))),
    switchMap(([[_, subjectId], group]: [[any, string], Group]) => {
      return this.rest.getProtectionSchedule(subjectId, group.groupId)
    }),
    switchMap((protectionSchedule) => {
      return [
        new SetLabs(protectionSchedule.labs),
        new SetLabsCalendar(protectionSchedule.scheduleProtectionLabs)
      ];
    })
  );
}
