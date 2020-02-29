import { Component, Input, OnInit } from '@angular/core';
import { MDCDialog } from '@material/dialog';
import { Lecture } from '../../../../models/lecture.model';
import { Attachment } from "../../../../models/attachment.model";

@Component({
  selector: 'app-lectures-list',
  templateUrl: './lectures-list.component.html',
  styleUrls: ['./lectures-list.component.less']
})
export class LecturesListComponent implements OnInit {

  @Input() lectures: Lecture[];

  public selectedAttachments: Attachment[];

  constructor() { }

  ngOnInit() {
  }

  _openPopup(attachments: Attachment[]) {
    this.selectedAttachments = attachments;
    const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
    dialog.open();
  }

  _filesDownload() {
    console.log()
  }

}
