import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AttachedFile } from 'src/app/models/file/attached-file.model'

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less'],
})
export class FileComponent implements OnInit {
  @Input() file: AttachedFile
  @Input() canDelete: boolean
  @Output() deleteFile = new EventEmitter<AttachedFile>()
  constructor() {}

  ngOnInit() {}

  getFileExtension(filename: string): string {
    return filename.split('.').pop()
  }
}
