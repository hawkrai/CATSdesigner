import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';

import * as filesActions from '../actions/files.actions';
import * as filesSelectors from '../selectors/files.selector';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IAppState } from '../states/app.state';
import { FilesService } from '../../service/files.service';


@Injectable()
export class FilesEffects {
  constructor(
    private actions$: Actions,
    private filesService: FilesService,
    private store: Store<IAppState>,
  ) { }

  downloadFile = createEffect(() => this.actions$.pipe(
    ofType(filesActions.downloadFile),
    tap(({ pathName, fileName }) => {
      window.open(`/api/Upload?fileName=${pathName}//${fileName}`, '_blank');
    })
  ), { dispatch: false });

  loadAttachments$ = createEffect(() => this.actions$.pipe(
    ofType(filesActions.loadAttachments),
    switchMap(({ values }) => this.filesService.getAttachments({ values, deleteValues: 'DELETE' }).pipe(
      map(files => filesActions.loadAttachmentsSuccess({ files }))
    ))
  ));

  uploadFile$ = createEffect(() => this.actions$.pipe(
    ofType(filesActions.uploadFile),
    withLatestFrom(this.store.select(filesSelectors.getFiles)),
    map(([{ file }, files]) => filesActions.addFile({ file, index: files.length }))
  ));

  addFile$ = createEffect(() => this.actions$.pipe(
    ofType(filesActions.addFile),
    switchMap(({ file, index }) => this.filesService.uploadFile(file).pipe(
      map(uploadedFile => filesActions.addFileSuccess({ file: uploadedFile, index }))
    ))
  ));

  deleteFile$ = createEffect(() => this.actions$.pipe(
    ofType(filesActions.deleteFile),
    switchMap(({ file }) => this.filesService.deleteFile(file.DeleteUrl).pipe(
      map(() => filesActions.deleteFileSuccess({ guidFileName: file.GuidFileName }))
    ))
  ));
}
