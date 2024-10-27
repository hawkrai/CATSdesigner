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
    const file = input.files[0]

    if (file && this.validTypes.includes(file.type)) {
      this.upload.emit(file)
    } else {
      this.toastr.error(
        this.translatePipe.transform(
          'complex.fileUploadError',
          'Можно добавить файл только формата .pdf, .docx или .doc'
        )
      )
    }
    input.value = null
  }

  deleteFile(file: AttachedFile) {
    this.delete.emit(file)
  }
}
