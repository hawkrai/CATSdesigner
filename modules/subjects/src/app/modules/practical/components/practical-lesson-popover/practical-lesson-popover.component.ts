import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../models/dialog-data.model';
import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './practical-lesson-popover.component.html',
  styleUrls: ['./practical-lesson-popover.component.less']
})
export class PracticalLessonPopoverComponent extends BaseFileManagementComponent {

  constructor(
    private dialogRef: MatDialogRef<PracticalLessonPopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData) {
    super(store, filesService);
  }

}
