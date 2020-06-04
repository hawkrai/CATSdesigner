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


  constructor(private fileService: FileService,
              private store$: Store<IAppState>) { }

  ngOnInit() {
    this.store$.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.fileService.getSubjectFile({subjectId}).subscribe(files => {
        console.log(files)
      })
    });
  }

}
