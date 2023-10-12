import { createEffect, Actions, ofType } from '@ngrx/effects'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import * as filesActions from './files.actions'

import { tap } from 'rxjs/operators'

@Injectable()
export class FilesEffects {
  constructor(private actions$: Actions) {}

  downloadFile = createEffect(
    () =>
      this.actions$.pipe(
        ofType(filesActions.downloadFile),
        tap(({ pathName, fileName }) => {
          window.open(`/api/Upload?fileName=${pathName}//${fileName}`, '_blank')
        })
      ),
    { dispatch: false }
  )
}
