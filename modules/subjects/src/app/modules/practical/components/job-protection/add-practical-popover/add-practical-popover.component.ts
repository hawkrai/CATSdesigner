import {
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  ValidationErrors,
} from '@angular/forms'
import { Component, Inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'

import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component'
import { DialogData } from '../../../../../models/dialog-data.model'
import { IAppState } from 'src/app/store/state/app.state'
import * as filesActions from '../../../../../store/actions/files.actions'
import * as practicalsActions from '../../../../../store/actions/practicals.actions'
import * as practicalsSelectors from '../../../../../store/selectors/practicals.selectors'
import { FilesService } from 'src/app/services/files.service'
import { attchedFileConverter } from '../../../../../utils'
import { take } from 'rxjs/operators'
import { Practical } from 'src/app/models/practical.model'
@Component({
  selector: 'app-practical-popover',
  templateUrl: './add-practical-popover.component.html',
  styleUrls: ['./add-practical-popover.component.less'],
})
export class AddPracticalPopoverComponent extends BaseFileManagementComponent {
  constructor(
    private dialogRef: MatDialogRef<AddPracticalPopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    super(store, filesService)
    this.setAttachments(this.data.model.attachments)
  }

  jobProtectionForm: FormGroup
  practicals$: Observable<Practical[]>

  get filesArray(): FormArray {
    return this.jobProtectionForm.get('attachments') as FormArray
  }

  ngOnInit(): void {
    this.loadAttachments()
    this.jobProtectionForm = new FormGroup(
      {
        practicalId: new FormControl(this.data.model.practicalId, [
          Validators.required,
        ]),
        comments: new FormControl(this.data.model.comments),
        attachments: new FormArray([]),
      },
      [this.validateForm.bind(this)]
    )

    this.store.dispatch(practicalsActions.loadPracticals())
    this.practicals$ = this.store.select(practicalsSelectors.selectPracticals)

    this.observeAttachments(this.filesArray)
  }

  validateForm(formGroup: FormGroup): ValidationErrors | null {
    const attachments = formGroup.get('attachments').value
    if (
      this.data.model.practicalId &&
      formGroup.get('practicalId').value === this.data.model.practicalId &&
      formGroup.get('comments').value === this.data.model.comments &&
      this.initAttachments.every((x) =>
        attachments.some((a) => a && a.IdFile === x.IdFile)
      ) &&
      this.data.model.attachments.length === attachments.length
    ) {
      return { form: true }
    }
    return null
  }

  onPaste(clipboardData: DataTransfer): void {
    if (clipboardData.files.length > 0) {
      this.store.dispatch(
        filesActions.uploadFile({ file: clipboardData.files[0] })
      )
    }
  }

  isValid(): boolean {
    return (
      this.filesArray.length > 0 ||
      (this.data.model.isTeacher &&
        !!this.jobProtectionForm.get('comments').value)
    )
  }

  onClose(toSave: boolean): void {
    if (toSave) {
      this.onSave()
    } else {
      this.removeFiles(this.filesArray.value.filter((f) => f.IdFile <= 0))
        .pipe(take(1))
        .subscribe({
          complete: () => {
            this.dialogRef.close()
          },
        })
    }
  }

  onSave(): void {
    if (this.jobProtectionForm.invalid || !this.isValid()) {
      return
    }
    const value = this.jobProtectionForm.value
    value.attachments = value.attachments.map((a) => attchedFileConverter(a))
    this.removeDeletedFiles()
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.dialogRef.close(value)
        },
      })
  }
}
