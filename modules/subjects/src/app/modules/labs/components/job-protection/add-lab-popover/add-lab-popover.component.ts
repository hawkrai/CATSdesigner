import { AttachedFile } from './../../../../../models/file/attached-file.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component';
import {DialogData} from '../../../../../models/dialog-data.model';
import { IAppState } from 'src/app/store/state/app.state';
import * as filesActions from '../../../../../store/actions/files.actions';
import { Lab } from 'src/app/models/lab.model';
import * as labsActions from '../../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../../store/selectors/labs.selectors';

@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './add-lab-popover.component.html',
  styleUrls: ['./add-lab-popover.component.less']
})
export class AddLabPopoverComponent extends BaseFileManagementComponent<AddLabPopoverComponent> {

  constructor(
    dialogRef: MatDialogRef<AddLabPopoverComponent>,
    store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) data: DialogData) {
      super(dialogRef, store, data);
  } 

  
  labs$: Observable<Lab[]>;

  ngOnInit(): void {
    this.store.dispatch(labsActions.loadLabs());
    this.labs$ = this.store.select(labsSelectors.getLabs);
    super.ngOnInit();
  }

  onPaste(clipboardData: DataTransfer): void {
    if (clipboardData.files.length > 0) {
      this.store.dispatch(filesActions.uploadFile({ file: clipboardData.files[0] }));
    }
  }

  isValid(files: AttachedFile[]): boolean {
    return this.data.model.labId && files.length === 1;
  }
}
