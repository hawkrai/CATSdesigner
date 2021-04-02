import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model';
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { IAppState } from 'src/app/store/state/app.state';

import * as labsActions from '../../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../../store/selectors/labs.selectors';

@Component({
  selector: 'app-teacher-job-protection',
  templateUrl: './teacher-job-protection.component.html',
  styleUrls: ['./teacher-job-protection.component.less']
})
export class TeacherJobProtectionComponent implements OnInit {

  groupJobProtection$: Observable<GroupJobProtection>;
  studentJobProtection$: Observable<StudentJobProtection>;
  labFiles$: Observable<UserLabFile[]>;

  selectedStudentId: number;
  selectedLabId: number;

  @Output() onAddFile = new EventEmitter<{ userId: number, labId: number }>();
  @Output() onReceiveLab = new EventEmitter<void>();
  @Output() onCheckPlugiarism = new EventEmitter<number>();

  constructor(
    private store: Store<IAppState>,
  ) { }

  ngOnInit() {
    this.groupJobProtection$ = this.store.select(labsSelectors.getGroupJobProtection);
  }

  addLab(event: MouseEvent, userId: number, labId: number): void {
    event.stopImmediatePropagation();
    this.onAddFile.emit({ userId, labId });
  }


  checkPlagiarism(userLabFileId: number){
    this.onCheckPlugiarism.emit(userLabFileId);
  }

  receiveLab(event: MouseEvent, labId: number, studentId: number): void {
    event.stopImmediatePropagation();
    this.store.dispatch(labsActions.receiveLab({ labId, studentId }));
  }

  cancelLab(event: MouseEvent, labId: number, studentId: number): void {
    event.stopImmediatePropagation();
    this.store.dispatch(labsActions.cancelLab({ labId, studentId }));
    
  }
  onSelectStudent(studentId: number): void {
    if (studentId) {
      this.selectedStudentId = studentId;
      this.store.dispatch(labsActions.loadStudentJobProtection({ studentId }));
      this.studentJobProtection$ = this.store.select(labsSelectors.getStudentJobProtection, { studentId });
    } else {
      this.store.dispatch(labsActions.resetStudentJobProtection({ studentId: this.selectedStudentId }));
      this.onSelectLab(0);
      this.selectedStudentId = 0
    }
  }

  onSelectLab(labId: number): void {
    if (labId) {
      this.selectedLabId = labId;
      this.store.dispatch(labsActions.loadStudentLabFiles({ userId: this.selectedStudentId, labId }));
      this.labFiles$ = this.store.select(labsSelectors.getStudentLabFiles, { studentId: this.selectedStudentId, labId });
    } else {
      this.store.dispatch(labsActions.resetStudentLabFiles({ studentId: this.selectedStudentId }));
      this.selectedLabId = 0; 
    }
  }
}
