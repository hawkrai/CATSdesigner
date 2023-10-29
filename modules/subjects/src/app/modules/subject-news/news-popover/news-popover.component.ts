import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'

import { BaseFileManagementComponent } from './../../../shared/base-file-management-dialog.component'
import { DialogData } from '../../../models/dialog-data.model'
import { IAppState } from 'src/app/store/state/app.state'
import { FilesService } from 'src/app/services/files.service'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { attchedFileConverter } from 'src/app/utils'

@Component({
  selector: 'app-news-popover',
  templateUrl: './news-popover.component.html',
  styleUrls: ['./news-popover.component.less'],
})
export class NewsPopoverComponent extends BaseFileManagementComponent {
  public Editor = ClassicEditor

  constructor(
    private dialogRef: MatDialogRef<NewsPopoverComponent>,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    super(store, filesService)
    this.setAttachments(this.data.model.attachments)
  }

  newsForm: FormGroup

  get filesArray(): FormArray {
    return this.newsForm.get('attachments') as FormArray
  }

  ngOnInit(): void {
    this.loadAttachments()
    this.newsForm = new FormGroup({
      id: new FormControl(this.data.model.id),
      title: new FormControl(this.data.model.title, [
        Validators.required,
        Validators.maxLength(256),
      ]),
      body: new FormControl(this.data.model.body),
      isOldDate: new FormControl(this.data.model.isOldDate),
      disabled: new FormControl(this.data.model.disabled),
      dateCreate: new FormControl(this.data.model.dateCreate),
      pathFile: new FormControl(this.data.model.pathFile),
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
    if (this.newsForm.invalid) {
      return
    }
    const value = this.newsForm.value
    value.attachments = value.attachments.map((a) => attchedFileConverter(a))
    this.dialogRef.close(value)
  }
}
