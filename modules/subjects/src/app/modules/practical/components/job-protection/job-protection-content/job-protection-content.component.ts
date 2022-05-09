import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { IAppState } from 'src/app/store/state/app.state';

import * as filesActions from '../../../../../store/actions/files.actions';
import { Attachment } from 'src/app/models/file/attachment.model';

@Component({
  selector: 'app-job-protection-content',
  templateUrl: './job-protection-content.component.html',
  styleUrls: ['./job-protection-content.component.less']
})
export class JobProtectionContentComponent implements OnInit {

  @Input() practicalFiles: UserLabFile[] = [];
  @Input() actionsTemplate: TemplateRef<any>;

  constructor(
    private store: Store<IAppState>
  ) { }
  public displayedColumns = ['practical', 'file', 'comments', 'date', 'action'];

  ngOnInit(): void {

  }

  downloadFile(attachment : Attachment): void {
    this.store.dispatch(filesActions.downloadFile({ pathName: attachment.PathName, fileName: attachment.FileName }));
  }
}
