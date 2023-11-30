import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'

import { map, switchMap } from 'rxjs/operators'
import { Message } from 'src/app/models/message.model'
import { SubjectService } from '../../services/subject.service'
import * as catsActions from '../actions/cats.actions'
import * as subjectActions from '../actions/subject.actions'

@Injectable()
export class SubjectEffect {
  constructor(
    private actions$: Actions,
    private subjectService: SubjectService
  ) {}

  saveSubject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subjectActions.saveSubject),
      switchMap(({ subject }) =>
        this.subjectService.saveSubject(subject).pipe(
          switchMap((body) => [
            catsActions.showMessage({ body }),
            catsActions.sendMessage({
              message: new Message('UpdateSubjects', ''),
            }),
            subjectActions.loadSubjects(),
          ])
        )
      )
    )
  )

  loadSubjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subjectActions.loadSubjects),
      switchMap(() =>
        this.subjectService
          .getSubjects()
          .pipe(
            map((subjects) => subjectActions.loadSubjectsSuccess({ subjects }))
          )
      )
    )
  )

  deleteSubject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subjectActions.deleteSubjectById),
      switchMap(({ subjectId }) =>
        this.subjectService.deleteSubject(subjectId).pipe(
          switchMap(() => [
            catsActions.sendMessage({
              message: new Message('UpdateSubjects', ''),
            }),
            subjectActions.loadSubjects(),
          ])
        )
      )
    )
  )

  loadSubject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(subjectActions.loadSubject),
      switchMap(({ subjectId }) =>
        this.subjectService
          .getSubject(subjectId)
          .pipe(
            map((subject) => subjectActions.loadSubjectSuccess({ subject }))
          )
      )
    )
  )
}
