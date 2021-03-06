import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { IAppState } from 'src/app/store/state/app.state';

import * as labsActions from '../../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../../store/selectors/labs.selectors';
import * as filesActions from '../../../../../store/actions/files.actions';
import { Attachment } from 'src/app/models/file/attachment.model';

@Component({
  selector: 'app-job-protection-content',
  templateUrl: './job-protection-content.component.html',
  styleUrls: ['./job-protection-content.component.less']
})
export class JobProtectionContentComponent implements OnInit, OnDestroy {

  @Input() labId: number;
  @Input() userId: number;
  @Input() actionsTemplate: TemplateRef<any>;

  constructor(
    private store: Store<IAppState>
  ) { }
  ngOnDestroy(): void {
    this.store.dispatch(labsActions.resetUserLabFiles());
  }
  public displayedColumns = ['file', 'comments', 'date', 'action'];
  state$: Observable<{
    labFiles: UserLabFile[]
  }>;

  ngOnInit(): void {
    this.store.dispatch(labsActions.loadUserLabFiles({ userId: this.userId, labId: this.labId }));

    this.state$ = combineLatest([
      this.store.select(labsSelectors.selectUserLabFiles)
    ]).pipe(
      map(([labFiles]) => ({ labFiles }))
    );
  }

  downloadFile(attachment : Attachment): void {
    this.store.dispatch(filesActions.downloadFile({ pathName: attachment.PathName, fileName: attachment.FileName }));
  }

}
