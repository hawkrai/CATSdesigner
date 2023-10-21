import { Component, Inject, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component'
import { DialogData } from '../../../../../models/dialog-data.model'
import { IAppState } from 'src/app/store/state/app.state'
import { FilesService } from 'src/app/services/files.service'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { attchedFileConverter } from 'src/app/utils'
import { whitespace } from 'src/app/shared/validators/whitespace.validator'

@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './lab-work-popover.component.html',
  styleUrls: ['./lab-work-popover.component.less'],
})
export class LabWorkPopoverComponent
  extends BaseFileManagementComponent
  implements OnInit
{
  constructor(
    private dialogRef: MatDialogRef<LabWorkPopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    super(store, filesService)
    this.setAttachments(this.data.model.attachments)
  }

  labForm: FormGroup

  get filesArray(): FormArray {
    return this.labForm.get('attachments') as FormArray
  }

  ngOnInit(): void {
    this.loadAttachments()
    this.labForm = new FormGroup({
      id: new FormControl(this.data.model.id),
      theme: new FormControl(this.data.model.theme, [
        Validators.required,
        whitespace,
        Validators.maxLength(256),
      ]),
      duration: new FormControl(this.data.model.duration, [
        Validators.required,
        Validators.min(1),
        Validators.max(36),
      ]),
      order: new FormControl(this.data.model.order),
      pathFile: new FormControl(this.data.model.pathFile),
      shortName: new FormControl(this.data.model.shortName),
      attachments: new FormArray([]),
    })
    this.observeAttachments(this.filesArray)
  }

  onClose(toSave: boolean): void {
    if (toSave) {
      this.onSave()
    } else {
      this.filesArray.value
        .filter((f) => f.IdFile <= 0)
        .forEach((f) => this.deleteFile(f))
      this.dialogRef.close()
    }
  }

  onSave(): void {
    if (this.labForm.invalid) {
      return
    }
    const value = this.labForm.value
    value.attachments = value.attachments.map((a) => attchedFileConverter(a))
    this.dialogRef.close(value)
  }
}
