import { Observable } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {IAppState} from '../../store/state/app.state';
import { AttachedFile } from 'src/app/models/file/attached-file.model';
import * as filesActions from '../../store/actions/files.actions';
import * as filesSelectors from '../../store/selectors/files.selectors';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit {

  public files$: Observable<AttachedFile[]>;

  constructor(
    private store: Store<IAppState>
    ) { }

  ngOnInit(): void {
    this.store.dispatch(filesActions.loadSubjectFiles());
    this.files$ = this.store.select(filesSelectors.getFiles);
  }

  deleteFile(file: AttachedFile) {
    this.store.dispatch(filesActions.deleteFile({ file }));
  }
}
