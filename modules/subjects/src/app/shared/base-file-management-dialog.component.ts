import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AttachedFile } from '../models/file/attached-file.model';
import { IAppState } from '../store/state/app.state';
import { FilesService } from '../services/files.service';
import { take } from 'rxjs/operators';
import { Attachment } from '../models/file/attachment.model';

export class BaseFileManagementComponent {
    private files$ = new BehaviorSubject<AttachedFile[]>([]);
    public attachments: Attachment[] = [];
    constructor(
        protected store: Store<IAppState>,
        protected filesService: FilesService,
    ) {

    }

    setAttachments(attachments: Attachment[]): void {
        this.attachments = attachments;
    }

    loadAttachments(): void {
        if (this.attachments && this.attachments.length) {
            const values = JSON.stringify(
                this.attachments.map(attachment => `${attachment.Name}/${attachment.Id}/${attachment.PathName}/${attachment.FileName}`
            ));
            this.filesService.getAttachments({ values, deleteValues: 'DELETE' }).pipe(
                take(1)
            ).subscribe(files => {
                this.files$.next(files);
            });
        }
    }

    uploadFile(file: File) {
        const files = this.files$.value;
        const index = files.length;
        this.files$.next([...files, null]);
        this.filesService.uploadFile(file).pipe(
            take(1)
        ).subscribe(file => {
            this.files$.next(files.slice(0, index).concat(file, files.slice(index + 1)));
        }, () => {
            this.files$.next(files.slice(0, index).concat(files.slice(index + 1)))
        });
        // this.store.dispatch(filesActions.uploadFile({ file }));
    }

    deleteFile(file: AttachedFile) {
        this.filesService.deleteFile(file.DeleteUrl).pipe(
            take(1)
        ).subscribe(() => {
            const files = this.files$.value;
            this.files$.next(files.filter(f => f.GuidFileName !== file.GuidFileName))
        });
    }

    getFiles(): Observable<AttachedFile[]> {
        return this.files$.asObservable();
    }

    setFiles(files: AttachedFile[]): void {
        this.files$.next(files);
    }
}