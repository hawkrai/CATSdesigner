import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import { map } from 'rxjs/operators';

import {IAppState} from '../../store/state/app.state';
import { AttachedFile } from 'src/app/models/file/attached-file.model';
import * as filesActions from '../../store/actions/files.actions';
import * as filesSelectors from '../../store/selectors/files.selectors';
import * as subjectSelector from '../../store/selectors/subject.selector';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit {

  state$: Observable<{ isTeacher: boolean, files: AttachedFile[] }>;
  constructor(
    private store: Store<IAppState>
    ) { }

  ngOnInit(): void {
    this.store.dispatch(filesActions.loadSubjectFiles());
    this.state$ = combineLatest(
      this.store.select(filesSelectors.getFiles),
      this.store.select(subjectSelector.isTeacher)
    ).pipe(map(([files, isTeacher]) => ({ files, isTeacher })));
  }

  deleteFile(file: AttachedFile) {
    this.store.dispatch(filesActions.deleteFile({ file }));
  }

  downloadAsZip(): void {
    this.store.dispatch(filesActions.downloadAsZipLoadedFiles());
  }
}
