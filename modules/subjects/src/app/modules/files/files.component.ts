import {Component, OnInit} from '@angular/core';
import {FileService} from '../../services/file.service';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {getSubjectId} from '../../store/selectors/subject.selector';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit {

  public files = [];

  constructor(private fileService: FileService,
              private store$: Store<IAppState>) { }

  ngOnInit() {
    this.store$.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.fileService.getSubjectFile({subjectId}).subscribe(attachments => {
        console.log(attachments)
        this.attachmentsToFiles([...attachments.Lectures, ...attachments.Labs, ...attachments.Practicals])
      })
    });
  }

  attachmentsToFiles(attachments) {
    let values = '["';
    attachments.forEach((attachment, index) => {
      values += attachment.Name + '/' + attachment.Id + '/' + attachment.PathName + '/' +
        attachment.FileName;
      if (index < attachments.length - 1) {
        values += '","'
      }
    });

    values += '"]';

    if (attachments.length) {
      this.fileService.getAttachment({values, deleteValues: 'DELETE'})
        .subscribe(files => this.files = files);
    }
  }

  deleteFile(file) {
    this.fileService.deleteFile(file.DeleteUrl)
      .subscribe(res => console.log(res));
  }
}
