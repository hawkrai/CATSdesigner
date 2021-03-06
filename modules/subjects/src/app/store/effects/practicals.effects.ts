import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, withLatestFrom, map } from 'rxjs/operators';

import * as practicalsActions from '../actions/practicals.actions';
import * as groupSelectors from '../selectors/groups.selectors';
import * as subjectSelectors from '../selectors/subject.selector';
import * as catsActions from '../actions/cats.actions';
import { PracticalRestService } from 'src/app/services/practical/practical-rest.service';
import { IAppState } from '../state/app.state';
import { ScheduleService } from "src/app/services/schedule.service";

@Injectable()
export class PracticalsEffects {

    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private rest: PracticalRestService,
        private scheduleService: ScheduleService
    ) {}

    loadPracticals$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadPracticals),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([_, subjectId]) => this.rest.getPracticals(subjectId).pipe(
            map(practicals =>  practicalsActions.loadPracticalsSuccess({ practicals }))
        ))
    ));

    loadSchedule$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadSchedule),
        withLatestFrom(
            this.store.select(groupSelectors.getCurrentGroupId),
            this.store.select(subjectSelectors.getSubjectId)
        ),
        switchMap(([_, groupId, subjectId]) => this.rest.getProtectionSchedule(subjectId, groupId).pipe(
            switchMap(({ practicals, scheduleProtectionPracticals }) => [
                practicalsActions.loadScheduleSuccess({ schedule: scheduleProtectionPracticals }),
                practicalsActions.loadPracticalsSuccess({ practicals })
            ])
        ))
    ));

    updateOrder$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.updateOrder),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ prevIndex, currentIndex }, subjectId]) => 
        this.rest.updatePracticalsOrder(subjectId, prevIndex, currentIndex))
    ), { dispatch: false });

    deletePractical$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.deletePractical),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ id }, subjectId]) => this.rest.deletePractical({ id, subjectId}).pipe(
            switchMap(body => [catsActions.showMessage({ body }), practicalsActions.loadPracticals()])
        ))
    ));

    createPractical$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.savePractical),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ practical }, subjectId]) => (practical.subjectId = subjectId, this.rest.savePractical(practical)).pipe(
            switchMap(body => [catsActions.showMessage({ body }), practicalsActions.loadPracticals()])
        ))
    ));

    createDateVisit$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.createDateVisit),
        withLatestFrom(
            this.store.select(subjectSelectors.getSubjectId),
            this.store.select(groupSelectors.getCurrentGroupId)
            ),
        switchMap(([{ obj }, subjectId, groupId]) => this.scheduleService.createPracticalDateVisit({ ...obj, subjectId, groupId }).pipe(
          map(() => practicalsActions.loadSchedule())
        ))
      ));
    
    deleteDateVisit$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.deleteDateVisit),
        switchMap(({ id }) => this.scheduleService.deletePracticalDateVisit(id).pipe(
            map(() => practicalsActions.loadSchedule())
        ))
    ));

    loadPracticalsVisitingMarks$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadMarks),
        withLatestFrom(
            this.store.select(groupSelectors.getCurrentGroupId),
            this.store.select(subjectSelectors.getSubjectId)
            ),
        switchMap(([_, groupId, subjectId]) => this.rest.getMarks(subjectId, groupId).pipe(
            map(students => practicalsActions.loadMarksSuccess({ students }))
        ))
    ));

    setPracticalsVisitingDate$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.setPracticalsVisitingDate),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ visiting }, subjectId]) => this.rest.setPracticalsVisitingDate({ ...visiting, subjectId }).pipe(
            switchMap((body) => [catsActions.showMessage({ body}), practicalsActions.loadMarks()])
        ))
    ));

    setPracticalMark$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.setPracticalMark),
        switchMap(({ body }) => this.rest.setPracticalMark({ ...body }).pipe(
            switchMap((body) => [catsActions.showMessage({ body }), practicalsActions.loadMarks()])
        ))
    ));
}