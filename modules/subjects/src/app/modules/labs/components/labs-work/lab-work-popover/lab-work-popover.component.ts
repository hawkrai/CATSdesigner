import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component';
import {DialogData} from '../../../../../models/dialog-data.model';
import { IAppState } from 'src/app/store/state/app.state';


@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './lab-work-popover.component.html',
  styleUrls: ['./lab-work-popover.component.less']
})
export class LabWorkPopoverComponent extends BaseFileManagementComponent<LabWorkPopoverComponent> {
  constructor(
    dialogRef: MatDialogRef<LabWorkPopoverComponent>,
    store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) data: DialogData) {
      super(dialogRef, store, data)
  }
}
