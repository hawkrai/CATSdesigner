import { Component, Input, OnInit } from '@angular/core';
import { FileExtension } from 'src/app/models/file/file-extension.enum';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.less']
})
export class FileViewerComponent implements OnInit {
  @Input() extension: string;
  constructor() { }

  ngOnInit() {
  }

  fileExtensions = FileExtension;

}
