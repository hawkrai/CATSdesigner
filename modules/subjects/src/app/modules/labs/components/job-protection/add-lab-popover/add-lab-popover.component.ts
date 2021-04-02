import { AttachedFile } from './../../../../../models/file/attached-file.model';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
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
import { FilesService } from 'src/app/services/files.service';
import { attchedFileConverter } from '../../../../../utils';
@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './add-lab-popover.component.html',
  styleUrls: ['./add-lab-popover.component.less']
})
export class AddLabPopoverComponent extends BaseFileManagementComponent{

  constructor(
    private dialogRef: MatDialogRef<AddLabPopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      super(store, filesService);
      this.setAttachments(this.data.model.attachments);
  } 

  jobProtectionForm:FormGroup;
  labs$: Observable<Lab[]>;

  get filesArray(): FormArray {
    return this.jobProtectionForm.get('attachments') as FormArray;
  }

  ngOnInit(): void {
    this.loadAttachments();
    this.jobProtectionForm = new FormGroup({
      labId: new FormControl(this.data.model.labId, [Validators.required]),
      comments: new FormControl(this.data.model.comments),
      attachments: new FormArray([], [Validators.required]),
    });

    this.store.dispatch(labsActions.loadLabs());
    this.labs$ = this.store.select(labsSelectors.getLabs);
    
    this.getFiles().subscribe(files => {
      this.filesArray.clear();
      files.forEach(file => {
        const group =  file ? new FormGroup(
          Object.keys(file).reduce((acc, key) => ({ ...acc, [key]: new FormControl(file[key]) }), {})
          ) : new FormControl(null);
          console.log(group);
        this.filesArray.push(group);
      });
    });
  }

  onPaste(clipboardData: DataTransfer): void {
    if (clipboardData.files.length > 0) {
      this.store.dispatch(filesActions.uploadFile({ file: clipboardData.files[0] }));
    }
  }

  isValid(files: AttachedFile[]): boolean {
    return this.data.model.labId && files.length === 1;
  }

  onClose(toSave: boolean): void {
    if (toSave) {
        this.onSave();
    } else {
        this.filesArray.value.filter(f => f.IdFile <= 0)
        .forEach(f => this.deleteFile(f));
        this.dialogRef.close();
    }
  }

  onSave(): void {
    if (this.jobProtectionForm.invalid) {
      return;
    }
    const value = this.jobProtectionForm.value;
    value.attachments = value.attachments.map(a => attchedFileConverter(a));
    this.dialogRef.close(value);
  }
}
