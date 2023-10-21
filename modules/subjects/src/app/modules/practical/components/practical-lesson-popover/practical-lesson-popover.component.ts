import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DialogData } from '../../../../models/dialog-data.model'
import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component'
import { IAppState } from 'src/app/store/state/app.state'
import { Store } from '@ngrx/store'
import { FilesService } from 'src/app/services/files.service'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { attchedFileConverter } from 'src/app/utils'
import { whitespace } from 'src/app/shared/validators/whitespace.validator'

@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './practical-lesson-popover.component.html',
  styleUrls: ['./practical-lesson-popover.component.less'],
})
export class PracticalLessonPopoverComponent extends BaseFileManagementComponent {
  constructor(
    private dialogRef: MatDialogRef<PracticalLessonPopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    super(store, filesService)
    this.setAttachments(this.data.model.attachments)
  }

  practicalForm: FormGroup

  get filesArray(): FormArray {
    return this.practicalForm.get('attachments') as FormArray
  }

  ngOnInit(): void {
    this.loadAttachments()
    this.practicalForm = new FormGroup({
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
    if (this.practicalForm.invalid) {
      return
    }
    const value = this.practicalForm.value
    value.attachments = value.attachments.map((a) => attchedFileConverter(a))
    this.dialogRef.close(value)
  }
}
