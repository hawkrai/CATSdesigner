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
        console.log(attachments);
        // this.attachmentsToFiles([...attachments.Lectures, ...attachments.Labs, ...attachments.Practicals])
      })
    });
  }

  attachmentsToFiles(attachments) {
    const values = JSON.stringify(attachments.map(a => `${a.Name}/${a.Id}/${a.PathName}/${a.FileName}`));

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
