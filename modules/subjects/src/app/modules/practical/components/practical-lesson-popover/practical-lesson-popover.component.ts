import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../models/dialog-data.model';
import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './practical-lesson-popover.component.html',
  styleUrls: ['./practical-lesson-popover.component.less']
})
export class PracticalLessonPopoverComponent extends BaseFileManagementComponent<PracticalLessonPopoverComponent> {

  constructor(
    dialogRef: MatDialogRef<PracticalLessonPopoverComponent>,
    store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) data: DialogData) {
    super(dialogRef, store, data)
  }

}
