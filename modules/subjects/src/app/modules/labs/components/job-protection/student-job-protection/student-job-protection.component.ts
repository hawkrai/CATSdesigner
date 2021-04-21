import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { IAppState } from 'src/app/store/state/app.state';

import * as labsActions from '../../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../../store/selectors/labs.selectors';
import * as subjectSelectors from '../../../../../store/selectors/subject.selector';


@Component({
  selector: 'app-student-job-protection',
  templateUrl: './student-job-protection.component.html',
  styleUrls: ['./student-job-protection.component.less']
})
export class StudentJobProtectionComponent implements OnInit {

  selectedLabId: number;

  state$: Observable<{
    labFiles: UserLabFile[],
    userId: number
  }>;

  @Output() onAddFile = new EventEmitter<{ userId: number, file: UserLabFile }>();
  @Output() onDeleteFile = new EventEmitter<{ userId: number, labId: number, userLabFileId: number }>();
  constructor(
    private store: Store<IAppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(labsActions.loadStudentLabFiles({ }));
    this.state$ = combineLatest([
      this.store.select(subjectSelectors.getUserId),
      this.store.select(labsSelectors.getStudentLabFiles, {})
    ]).pipe(
      map(([userId, labFiles]) => ({ labFiles, userId }))
    );
  }

  addLab(userId: number, file: UserLabFile): void {
    this.onAddFile.emit({ userId, file });
  }

  deleteLab(userLabFileId: number, userId: number, labId: number): void {
    this.onDeleteFile.emit({ userLabFileId, userId, labId });
  }

}
