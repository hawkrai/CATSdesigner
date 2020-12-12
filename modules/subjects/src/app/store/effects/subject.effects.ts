import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import { SubjectService } from '../../services/subject.service';
import * as subjectActions from '../actions/subject.actions';
import { map, switchMap, tap } from 'rxjs/operators';
import * as catsActions from '../actions/cats.actions';
import { Message } from 'src/app/models/message.model';
import { IAppState } from '../state/app.state';

@Injectable()
export class SubjectEffect {

    constructor(
        private actions$: Actions,
        private subjectService: SubjectService,
        private store: Store<IAppState>
    ) {}

    saveSubject$ = createEffect(() => this.actions$.pipe(
        ofType(subjectActions.saveSubject),
        switchMap(({ subject }) => this.subjectService.saveSubject(subject).pipe(
            map(() => subjectActions.loadSubjects()),
            tap(() => {
                this.store.dispatch(catsActions.sendMessage({ message: new Message('UpdateSubjects', '')}));
            })
        ))
    ));

    loadSubjects$ = createEffect(() => this.actions$.pipe(
        ofType(subjectActions.loadSubjects),
        switchMap(() => this.subjectService.getSubjects().pipe(
            map(subjects => subjectActions.loadSubjectsSuccess({ subjects }))
        ))
    ));

    deleteSubject$ = createEffect(() => this.actions$.pipe(
        ofType(subjectActions.deleteSubejctById),
        switchMap(({ subjectId }) => this.subjectService.deleteSubject(subjectId).pipe(
            map(() => subjectActions.loadSubjects()),
            tap(() => {
                this.store.dispatch(catsActions.sendMessage({ message: new Message('UpdateSubjects', '')}));
            })
        ))
    ));
}