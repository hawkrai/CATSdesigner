import { AttachedFile } from './../../../models/attached-file.model';
import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.less']
})
export class FileUploaderComponent {

  @Input() header: string;
  @Input() files: AttachedFile[] = [];
  @Output() delete = new EventEmitter<AttachedFile>();
  @Output() upload = new EventEmitter<File>();

  uploadFile(input: HTMLInputElement) {
    this.upload.emit(input.files[0]);
  }

  deleteFile(file: AttachedFile) {
    this.delete.emit(file);
  }

}
