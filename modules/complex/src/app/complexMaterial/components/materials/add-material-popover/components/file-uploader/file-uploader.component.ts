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
  @Input() maxFiles: number = 5
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
    input.value = ''

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

  deleteFile(file: AttachedFile) {
    this.delete.emit(file)
  }
}
