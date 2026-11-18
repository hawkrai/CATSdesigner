import { Component, Input, EventEmitter, Output } from '@angular/core'
import { AttachedFile } from '../../../../../../models/AttachedFile'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'
import { FileExtension } from '../../../../../../models/file/file-extension.enum'
import { MaterialMimeType } from '../../../../../../models/file/material-mime-type.enum'

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.less'],
})
export class FileUploaderComponent {
  @Input() header: string
  @Input() disabled: boolean
  @Input() maxFiles: number = 5
  @Input() files: AttachedFile[] = []
  @Output() delete = new EventEmitter<AttachedFile>()
  @Output() upload = new EventEmitter<File>()

  readonly validTypes: string[] = [MaterialMimeType.Pdf, MaterialMimeType.DocX]
  readonly validExtensions: string[] = [FileExtension.Pdf, FileExtension.DocX]
  readonly acceptedFiles = this.validExtensions.map((ext) => `.${ext}`).join(',')

  constructor(
    protected translatePipe: TranslatePipe,
    private toastr: ToastrService
  ) {}

  uploadFile(input: HTMLInputElement) {
    const files = Array.from(input.files || [])
    input.value = ''

    if (files.length === 0) {
      return
    }

    const invalidFiles = files.filter((file) => !this.isValidFile(file))
    if (invalidFiles.length > 0) {
      this.toastr.error(
        this.translatePipe.transform(
          'complex.fileUploadError',
          'Можно добавить файл только формата .pdf или .docx'
        )
      )
      return
    }

    const availableSlots = this.maxFiles - this.files.length
    if (availableSlots <= 0) {
      return
    }

    const filesToUpload = files.slice(0, availableSlots)
    filesToUpload.forEach(file => {
      this.upload.emit(file)
    })
  }

  private isValidFile(file: File): boolean {
    const extension = (file.name.split('.').pop() || '').toLowerCase()
    return (
      this.validExtensions.includes(extension) &&
      (!file.type || this.validTypes.includes(file.type))
    )
  }

  deleteFile(file: AttachedFile) {
    this.delete.emit(file)
  }
}
