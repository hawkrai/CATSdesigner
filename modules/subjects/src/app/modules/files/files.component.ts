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
import { Help } from 'src/app/models/help.model';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit {

  state$: Observable<{ isTeacher: boolean, files: AttachedFile[], isDownloading: boolean }>;
  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe
    ) { }

  ngOnInit(): void {
    this.store.dispatch(filesActions.loadSubjectFiles());
    this.state$ = combineLatest(
      this.store.select(filesSelectors.getFiles),
      this.store.select(subjectSelector.isTeacher),
      this.store.select(filesSelectors.isDownloading)
    ).pipe(map(([files, isTeacher, isDownloading]) => ({ files, isTeacher, isDownloading })));
  }

  deleteFile(file: AttachedFile) {
    this.store.dispatch(filesActions.deleteFile({ file }));
  }

  downloadAsZip(): void {
    this.store.dispatch(filesActions.downloadAsZipLoadedFiles());
  }

  filesHelp: Help = {
    message: this.translate.transform('text.help.popover.files', 'Файлы.'), 
    action: this.translate.transform('button.understand','Понятно')
  };
}
