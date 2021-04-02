import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component';
import {DialogData} from '../../../../../models/dialog-data.model';
import { IAppState } from 'src/app/store/state/app.state';
import { FilesService } from 'src/app/services/files.service';


@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './lab-work-popover.component.html',
  styleUrls: ['./lab-work-popover.component.less']
})
export class LabWorkPopoverComponent extends BaseFileManagementComponent {
  constructor(
    private dialogRef: MatDialogRef<LabWorkPopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData) {
      super(store, filesService);
      this.attachments = this.data.body.attachments;
  }
}
