import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import { SubjectService } from '../../services/subject.service';
import * as subjectActions from '../actions/subject.actions';
import { map, switchMap } from 'rxjs/operators';
import * as catsActions from '../actions/cats.actions';
import { Message } from 'src/app/models/message.model';

@Injectable()
export class SubjectEffect {

    constructor(
        private actions$: Actions,
        private subjectService: SubjectService
    ) {}

    saveSubject$ = createEffect(() => this.actions$.pipe(
        ofType(subjectActions.saveSubject),
        switchMap(({ subject }) => this.subjectService.saveSubject(subject).pipe(
            switchMap(body =>[
                catsActions.sendMessage({ message: new Message('UpdateSubjects', '')}), 
                catsActions.showMessage({ body }),
                subjectActions.loadSubjects()]),
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
            switchMap(() => [catsActions.sendMessage({ message: new Message('UpdateSubjects', '')}), subjectActions.loadSubjects()])
        ))
    ));
}