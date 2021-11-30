import { AttachedFile } from './../../../../../models/file/attached-file.model';
import { FormControl, Validators, FormGroup, FormArray, ValidationErrors } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';

import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component';
import { DialogData } from '../../../../../models/dialog-data.model';
import { IAppState } from 'src/app/store/state/app.state';
import * as filesActions from '../../../../../store/actions/files.actions';
import { Lab } from 'src/app/models/lab.model';
import * as labsActions from '../../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../../store/selectors/labs.selectors';
import { FilesService } from 'src/app/services/files.service';
import { attchedFileConverter } from '../../../../../utils';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './add-lab-popover.component.html',
  styleUrls: ['./add-lab-popover.component.less']
})
export class AddLabPopoverComponent extends BaseFileManagementComponent {

  constructor(
    private dialogRef: MatDialogRef<AddLabPopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    super(store, filesService);
    this.setAttachments(this.data.model.attachments);
  }

  jobProtectionForm: FormGroup;
  labs$: Observable<Lab[]>;

  get filesArray(): FormArray {
    return this.jobProtectionForm.get('attachments') as FormArray;
  }

  ngOnInit(): void {
    this.loadAttachments();
    this.jobProtectionForm = new FormGroup({
      labId: new FormControl(this.data.model.labId, [Validators.required]),
      comments: new FormControl(this.data.model.comments),
      attachments: new FormArray([]),
    }, [this.validateForm.bind(this)]);

    this.store.dispatch(labsActions.loadLabs());
    this.labs$ = this.store.select(labsSelectors.getLabs);


    this.observeAttachments(this.filesArray);
  }

  validateForm(formGroup: FormGroup): ValidationErrors | null {
    const attachments = formGroup.get('attachments').value;
    if (this.data.model.labId && (formGroup.get('labId').value === this.data.model.labId &&
      formGroup.get('comments').value === this.data.model.comments &&
      (this.initAttachments.every(x => attachments.some(a => a && a.IdFile === x.IdFile)) && this.data.model.attachments.length === attachments.length))) {
      return { form: true };
    }
    return null;
  }

  onPaste(clipboardData: DataTransfer): void {
    if (clipboardData.files.length > 0) {
      this.store.dispatch(filesActions.uploadFile({ file: clipboardData.files[0] }));
    }
  }

  isValid(): boolean {
    return this.filesArray.length > 0 || (this.data.model.isTeacher && !!this.jobProtectionForm.get('comments').value);
  }

  onClose(toSave: boolean): void {
    if (toSave) {
      this.onSave();
    } else {
      this.removeFiles(this.filesArray.value.filter(f => f.IdFile <= 0)).pipe(take(1)).subscribe({
        complete: () => {
          this.dialogRef.close();
        }
      });
    }
  }

  onSave(): void {
    if (this.jobProtectionForm.invalid || !this.isValid()) {
      return;
    }
    const value = this.jobProtectionForm.value;
    value.attachments = value.attachments.map(a => attchedFileConverter(a));
    this.removeDeletedFiles().pipe(take(1)).subscribe({
      complete: () => {
        this.dialogRef.close(value);
      }
    });

  }
}
