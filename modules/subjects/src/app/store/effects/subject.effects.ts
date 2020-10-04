import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import {SubjectService} from '../../services/subject.service';
import * as subjectActions from '../actions/subject.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class SubjectEffects {

  constructor(
    private actions$: Actions,
    private subjectService: SubjectService
  ) {}

  loadSubjects$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(subjectActions.loadSubjects),
    switchMap(() => this.subjectService.getSubjects().pipe(
      map(subjects => subjectActions.loadSubjectsSuccess({ subjects })),
      catchError(error => of(subjectActions.loadSubjectsFail({ error })))
    ))
  ));

  deleteSubject$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(subjectActions.deleteSubject),
    switchMap(action => this.subjectService.deleteSubjects(action.id).pipe(
      map(() => subjectActions.deleteSubjectSuccess())
    ))
  ));

  saveSubject$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(subjectActions.saveSubject),
    switchMap(action => this.subjectService.saveSubject(action.subject).pipe(
      map(() => subjectActions.saveSubjectSuccess())
    ))
  ));

  managementSuccess$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(subjectActions.saveSubjectSuccess, subjectActions.deleteSubjectSuccess),
    map(() => subjectActions.loadSubjects())
  ));

}
