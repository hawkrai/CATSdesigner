import { BehaviorSubject, from, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AttachedFile } from '../models/file/attached-file.model';
import { IAppState } from '../store/state/app.state';
import { FilesService } from '../services/files.service';
import { take } from 'rxjs/operators';
import { Attachment } from '../models/file/attachment.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export class BaseFileManagementComponent {
    protected files$ = new BehaviorSubject<AttachedFile[]>([]);
    public attachments: Attachment[] = [];
    constructor(
        protected store: Store<IAppState>,
        protected filesService: FilesService,
    ) {

    }

    initAttachments: AttachedFile[] = [];
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
                this.initAttachments = files;
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
    }

    deleteFile(file: AttachedFile) {
        this.deletedFiles.push(file);
        const files = this.files$.value;
        this.files$.next(files.filter(f => f.GuidFileName !== file.GuidFileName))
    }


    private deletedFiles: AttachedFile[] = [];

    observeAttachments(filesArray: FormArray): void {
        this.getFiles().subscribe(files => {
            filesArray.clear();
            files.forEach(file => {
              const group =  file ? new FormGroup(
                Object.keys(file).reduce((acc, key) => ({ ...acc, [key]: new FormControl(file[key]) }), {})
                ) : new FormControl(null);
              filesArray.push(group);
            });
        });
    }

    getFiles(): Observable<AttachedFile[]> {
        return this.files$.asObservable();
    }

    setFiles(files: AttachedFile[]): void {
        this.files$.next(files);
    }

    removeFiles(files: AttachedFile[]): Observable<any> {
       return from(files.map(file => this.filesService.deleteFile(file.DeleteUrl)));
    }

    removeDeletedFiles() {
        return this.removeFiles(this.deletedFiles);
    }

}