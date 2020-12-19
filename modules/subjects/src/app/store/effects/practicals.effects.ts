import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, withLatestFrom, map } from 'rxjs/operators';

import * as practicalsActions from '../actions/practicals.actions';
import * as practicalsSelectros from '../selectors/practicals.selectors';
import * as groupSelectors from '../selectors/groups.selectors';
import * as subjectSelectors from '../selectors/subject.selector';
import * as catsActions from '../actions/cats.actions';
import { PracticalRestService } from 'src/app/services/practical/practical-rest.service';
import { IAppState } from '../state/app.state';

@Injectable()
export class PracticalsEffects {

    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private rest: PracticalRestService
    ) {}

    loadPracticals$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadPracticals),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([_, subjectId]) => this.rest.getPracticals(subjectId).pipe(
            map(practicals =>  practicalsActions.loadPracticalsSuccess({ practicals }))
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
}