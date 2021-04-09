import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component';
import {Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../models/dialog-data.model';
import { AttachedFile } from 'src/app/models/file/attached-file.model';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { FilesService } from 'src/app/services/files.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { attchedFileConverter } from 'src/app/utils';

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
      this.setAttachments(this.data.model.attachments);
  }

  lectureForm: FormGroup;


  get filesArray(): FormArray {
    return this.lectureForm.get('attachments') as FormArray;
  }

  ngOnInit(): void {
    this.loadAttachments();
    this.lectureForm = new FormGroup({
      id: new FormControl(this.data.model.id),
      theme: new FormControl(this.data.model.theme, [Validators.required, Validators.maxLength(256)]),
      duration: new FormControl(this.data.model.duration, [Validators.min(1), Validators.max(5), Validators.required]),
      order: new FormControl(this.data.model.order),
      pathFile: new FormControl(this.data.model.pathFile),
      attachments: new FormArray([]),
    });
    this.observeAttachments(this.filesArray);
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
    if (this.lectureForm.invalid) {
      return;
    }
    const value = this.lectureForm.value;
    value.attachments = value.attachments.map(a => attchedFileConverter(a));
    this.dialogRef.close(value);
  }
}
