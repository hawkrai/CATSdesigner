import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';

import { FilesService } from './../../services/files.service';
import * as filesActions from '../actions/files.actions';
import * as filesSelectors from '../selectors/files.selectors';
import * as subjectSelectors from '../selectors/subject.selector';
import * as groupsSelectors from '../selectors/groups.selectors';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IAppState } from '../state/app.state';
import { SubjectService } from 'src/app/services/subject.service';
import { CoreService } from 'src/app/services/core.service';

@Injectable()
export class FilesEffects {
    constructor(
        private actions$: Actions,
        private store: Store<IAppState>,
        private filesService: FilesService,
        private coreService: CoreService,
        private subjectService: SubjectService
    ) {}

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

    loadSubjectFiles$ = createEffect(() => this.actions$.pipe(
        ofType(filesActions.loadSubjectFiles),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([_, subjectId]) => this.filesService.getSubjectFiles(subjectId)),
        map(attachments => JSON.stringify(attachments.map(a => `${a.Name}/${a.Id}/${a.PathName}/${a.FileName}`))),
        map(values => filesActions.loadAttachments({ values }))
    ));

    downloadExcel = createEffect(() => this.actions$.pipe(
        ofType(filesActions.getExcelData),
        tap(({ response }) => {
            this.coreService.downloadAsExcel(response);
        })
    ), { dispatch: false });

    downloadZip = createEffect(() => this.actions$.pipe(
        ofType(filesActions.getZipData),
        tap(({ response }) => {
            this.coreService.downloadAsZip(response);
        })
    ), { dispatch: false });
    
    getAttachemntsAsZip = createEffect(() => this.actions$.pipe(
        ofType(filesActions.getAttachmentsAsZip),
        switchMap(({ attachmentsIds }) => this.subjectService.getAttachmentsAsZip(attachmentsIds)),
        tap((response) => {
            this.coreService.downloadAsZip(response);
        })
    ), { dispatch: false });

    downlaodAsZipLoadedFiles$ = createEffect(() => this.actions$.pipe(
        ofType(filesActions.downloadAsZipLoadedFiles),
        withLatestFrom(this.store.select(filesSelectors.getFiles)),
        map(([_, files]) => filesActions.getAttachmentsAsZip({ attachmentsIds: files.map(f => f.IdFile )}))
    ));
}
