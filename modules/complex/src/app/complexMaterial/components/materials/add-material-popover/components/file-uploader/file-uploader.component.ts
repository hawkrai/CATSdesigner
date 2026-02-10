import { Component, Input, EventEmitter, Output } from '@angular/core'
import { AttachedFile } from '../../../../../../models/AttachedFile'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.less'],
})
export class FileUploaderComponent {
  @Input() header: string
  @Input() disabled: boolean
  @Input() files: AttachedFile[] = []
  @Output() delete = new EventEmitter<AttachedFile>()
  @Output() upload = new EventEmitter<File>()

  validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  constructor(
    protected translatePipe: TranslatePipe,
    private toastr: ToastrService
  ) {}

  uploadFile(input: HTMLInputElement) {
    const files = Array.from(input.files || [])

    if (files.length === 0) {
      return
    }

    const invalidFiles = files.filter(file => !this.validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      this.toastr.error(
        this.translatePipe.transform(
          'complex.fileUploadError',
          'Можно добавить файл только формата .pdf, .docx или .doc'
        )
      )
      input.value = null
      return
    }

    const maxFiles = 15
    const currentFilesCount = this.files.length
    const availableSlots = maxFiles - currentFilesCount
    
    if (availableSlots <= 0) {
      this.toastr.error(
        this.translatePipe.transform(
          'complex.maxFilesReached',
          'Достигнут максимальный лимит файлов (15)'
        )
      )
      input.value = null
      return
    }

    const filesToUpload = files.slice(0, availableSlots)
    
    if (files.length > availableSlots) {
      this.toastr.warning(
        this.translatePipe.transform(
          'complex.filesLimitWarning',
          `Можно добавить только ${availableSlots} файл(ов). Остальные файлы не были добавлены.`
        )
      )
    }

    filesToUpload.forEach(file => {
      this.upload.emit(file)
    })
    
    input.value = null
  }

  deleteFile(file: AttachedFile) {
    this.delete.emit(file)
  }
}
