import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { switchMap, withLatestFrom, map } from 'rxjs/operators';

import * as practicalsActions from '../actions/practicals.actions';
import * as groupSelectors from '../selectors/groups.selectors';
import * as subjectSelectors from '../selectors/subject.selector';
import { PracticalRestService } from 'src/app/services/practical/practical-rest.service';
import { IAppState } from '../state/app.state';
import { ConverterService } from 'src/app/services/converter.service';

@Injectable()
export class PracticalsEffects {

    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private converterService: ConverterService,
        private practicalsService: PracticalRestService
    ) {}

    loadPracticals$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadPracticals),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([_, subjectId]) => this.practicalsService.getPracticals(subjectId).pipe(
            map(practicals =>  practicalsActions.loadPracticalsSuccess({ practicals }))
        ))
    ));

    deletePractical$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.deletePractical),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ id }, subjectId]) => this.practicalsService.deletePractical({ id, subjectId}).pipe(
            map(() => practicalsActions.loadPracticals())
        ))
    ));

    createPractical$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.savePractical),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ practical }, subjectId]) => (practical.subjectId = subjectId, this.practicalsService.savePractical(practical)).pipe(
            map(() => practicalsActions.loadPracticals())
        ))
    ));

    // updatePracticals$ = createEffect(() => this.actions$.pipe(
    //     ofType(practicalsActions.updatePracticals),
    //     map(({ practicals }) => this.converterService.practicalsUpdateConverter(practicals)),
    //     switchMap(practicals => this.practicalsService.updatePracticals(practicals))
    //   ), { dispatch: false });
}