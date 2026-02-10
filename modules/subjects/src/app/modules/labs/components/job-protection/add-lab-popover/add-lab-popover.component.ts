import {
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  ValidationErrors,
} from '@angular/forms'
import { Component, Inject, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

import { BaseFileManagementComponent } from 'src/app/shared/base-file-management-dialog.component'
import { DialogData } from '../../../../../models/dialog-data.model'
import { IAppState } from 'src/app/store/state/app.state'
import * as filesActions from '../../../../../store/actions/files.actions'
import { Lab } from 'src/app/models/lab.model'
import * as labsActions from '../../../../../store/actions/labs.actions'
import * as labsSelectors from '../../../../../store/selectors/labs.selectors'
import { FilesService } from 'src/app/services/files.service'
import { attchedFileConverter } from '../../../../../utils'
import { LabPositionsService } from 'src/app/services/lab-positions.service'

export class AttachedFile {
  DeleteType: string
  DeleteUrl: string
  Error: string
  Group: string
  IdFile: number
  Name: string
  Progress: string
  Size: number
  ThumbnailUrl: string
  Type: string
  Url: string
  GuidFileName: string
  CreationDate: Date
}

interface LabWithColor extends Lab {
  RowColor: string
}

@Component({
  selector: 'app-lab-work-popover',
  templateUrl: './add-lab-popover.component.html',
  styleUrls: ['./add-lab-popover.component.less'],
})
export class AddLabPopoverComponent
  extends BaseFileManagementComponent
  implements OnInit
{
  jobProtectionForm: FormGroup
  labs$: Observable<LabWithColor[]>
  uploading = false

  constructor(
    private labPositionsService: LabPositionsService,
    private dialogRef: MatDialogRef<AddLabPopoverComponent>,
    private sanitizer: DomSanitizer,
    store: Store<IAppState>,
    filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    super(store, filesService)
    this.setAttachments(this.data.model.attachments)
  }

  get filesArray(): FormArray {
    return this.jobProtectionForm.get('attachments') as FormArray
  }

  ngOnInit(): void {
    this.loadAttachments()

    this.jobProtectionForm = new FormGroup(
      {
        labId: new FormControl(this.data.model.labId, [Validators.required]),
        comments: new FormControl(this.data.model.comments),
        attachments: new FormArray([]),
      },
      [this.validateForm.bind(this)]
    )

    this.store.dispatch(labsActions.loadLabs())

    this.labs$ = this.store.select(labsSelectors.getLabs).pipe(
      map((labs) =>
        labs.map((lab, index) => ({
          ...lab,
          RowColor: this.labPositionsService.labPositions.includes(index + 1)
            ? '#d5fcd5'
            : lab.IsReceived
              ? '#d5fcd5'
              : '#ffffff',
        }))
      )
    )

    this.observeAttachments(this.filesArray)
  }

  validateForm(formGroup: FormGroup): ValidationErrors | null {
    const attachments = formGroup.get('attachments').value
    if (
      this.data.model.labId &&
      formGroup.get('labId').value === this.data.model.labId &&
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

  onPaste(event: ClipboardEvent): void {
    event.preventDefault()

    const clipboardData = event.clipboardData
    if (!clipboardData) return

    if (clipboardData.files && clipboardData.files.length > 0) {
      const file = clipboardData.files[0]
      if (this.isImage(file)) {
        this.uploadPastedImage(file)
      }
      return
    }

    const items = clipboardData.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile()
          if (blob) {
            const file = new File([blob], `screenshot-${Date.now()}.png`, {
              type: blob.type,
              lastModified: Date.now(),
            })
            this.uploadPastedImage(file)
          }
          return
        }
      }
    }
  }

  private isImage(file: File): boolean {
    return file.type.startsWith('image/')
  }

  private uploadPastedImage(file: File): void {
    this.uploading = true

    const blobUrl = URL.createObjectURL(file)
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl)

    const tempAttachment: Partial<AttachedFile> & { isUploading: boolean } = {
      IdFile: -1,
      Name: file.name || 'Скриншот.png',
      Size: file.size,
      Type: 'Image',
      ThumbnailUrl: blobUrl,
      Url: '#',
      GuidFileName: `temp-${Date.now()}`,
      CreationDate: new Date(),
      DeleteType: '',
      DeleteUrl: '',
      Error: '',
      Group: '',
      Progress: '',
      isUploading: true,
    }

    this.filesArray.push(new FormControl(tempAttachment as AttachedFile))

    this.filesService.uploadFile(file).subscribe({
      next: (response) => {
        const index = this.filesArray.controls.findIndex((c) => {
          const val = c.value as AttachedFile
          return val && val.IdFile === -1
        })

        if (index !== -1) {
          this.filesArray.at(index).patchValue({
            IdFile: response.IdFile,
            Name: response.Name || tempAttachment.Name,
            Size: response.Size || tempAttachment.Size,
            Type: response.Type || tempAttachment.Type,
            ThumbnailUrl: response.ThumbnailUrl || blobUrl,
            Url: response.Url || '#',
            GuidFileName: response.GuidFileName || tempAttachment.GuidFileName,
            CreationDate: response.CreationDate || tempAttachment.CreationDate,
            DeleteType: response.DeleteType || '',
            DeleteUrl: response.DeleteUrl || '',
            Error: response.Error || '',
            Group: response.Group || '',
            Progress: response.Progress || '',
          } as AttachedFile)
        }

        this.uploading = false
      },
      error: (err) => {
        this.uploading = false

        const index = this.filesArray.controls.findIndex((c) => {
          const val = c.value as AttachedFile
          return val && val.IdFile === -1
        })

        if (index !== -1) {
          this.filesArray.at(index).patchValue({
            Error: 'Ошибка загрузки',
          } as AttachedFile)
        }
      },
    })
  }

  isValid(): boolean {
    return (
      this.filesArray.length > 0 ||
      (this.data.model.isTeacher &&
        !!this.jobProtectionForm.get('comments').value)
    )
  }

  canSave(): boolean {
    return this.isValid() && !this.uploading
  }

  onClose(toSave: boolean): void {
    if (toSave) {
      this.onSave()
    } else {
      this.removeFiles(this.filesArray.value.filter((f: AttachedFile) => f.IdFile <= 0))
        .pipe(take(1))
        .subscribe({
          complete: () => {
            this.dialogRef.close()
          },
        })
    }
  }

  onSave(): void {
    if (this.jobProtectionForm.invalid || !this.isValid() || this.uploading) {
      return
    }

    const value = this.jobProtectionForm.value

    value.attachments = (value.attachments || []).map((a: AttachedFile) =>
      attchedFileConverter(a)
    )

    this.removeDeletedFiles()
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.dialogRef.close(value)
        },
      })
  }
}