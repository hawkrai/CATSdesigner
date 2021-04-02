import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component';
import {Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../models/dialog-data.model';
import { AttachedFile } from 'src/app/models/file/attached-file.model';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-lecture-popover',
  templateUrl: './lecture-popover.component.html',
  styleUrls: ['./lecture-popover.component.less']
})
export class LecturePopoverComponent extends BaseFileManagementComponent {

  constructor(
    private dialogRef: MatDialogRef<LecturePopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      super(store, filesService);
  }
}
