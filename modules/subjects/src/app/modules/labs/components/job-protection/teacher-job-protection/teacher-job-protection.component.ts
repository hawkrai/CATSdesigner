import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lab } from 'src/app/models/lab.model';
import { StudentMark } from 'src/app/models/student-mark.model';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { IAppState } from 'src/app/store/state/app.state';

import * as labsActions from '../../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../../store/selectors/labs.selectors';
import * as subjectSelectors from '../../../../../store/selectors/subject.selector';

@Component({
  selector: 'app-teacher-job-protection',
  templateUrl: './teacher-job-protection.component.html',
  styleUrls: ['./teacher-job-protection.component.less']
})
export class TeacherJobProtectionComponent implements OnInit {

  state$: Observable<{
    students: StudentMark[],
    labs: Lab[],
  }>;

  selectedStudentId: number;

  @Output() onAddFile = new EventEmitter<{ userId: number, file: UserLabFile }>();
  @Output() onReceiveLab = new EventEmitter<void>();
  @Output() onDeleteFile = new EventEmitter<{ userId: number, labId: number, userLabFileId: number }>();
  @Output() onCheckPlugiarism = new EventEmitter<number>();

  constructor(
    private store: Store<IAppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(labsActions.loadLabs());

    this.state$ = combineLatest([
      this.store.select(labsSelectors.getStudentsLabsFiles),
      this.store.select(labsSelectors.getLabs),
    ]).pipe(
      map(([students, labs]) => ({ students, labs }))
    );
  }

  addLab(userId: number, file: UserLabFile): void {
    this.onAddFile.emit({ userId, file });
  }

  deleteLab(userLabFileId: number, userId: number, labId: number): void {
    this.onDeleteFile.emit({ userLabFileId, userId, labId });
  }

  checkPlagiarism(userLabFileId: number){
    this.onCheckPlugiarism.emit(userLabFileId);
  }

  receiveLab(): void {

  }

  cancelReceivedLab(): void {
    
  }
}
