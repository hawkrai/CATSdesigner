import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Store } from '@ngrx/store'
import { combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model'
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { IAppState } from 'src/app/store/state/app.state'

import * as labsActions from '../../../../../store/actions/labs.actions'
import * as labsSelectors from '../../../../../store/selectors/labs.selectors'

@Component({
  selector: 'app-teacher-job-protection',
  templateUrl: './teacher-job-protection.component.html',
  styleUrls: ['./teacher-job-protection.component.less'],
})
export class TeacherJobProtectionComponent implements OnInit {
  groupJobProtection$: Observable<GroupJobProtection>
  labFiles$: Observable<UserLabFile[]>

  selectedStudentId: number

  @Output() onAddFile = new EventEmitter<{
    userId: number
    labId: number
    fileId: number
  }>()
  @Output() onReceiveLab = new EventEmitter<void>()
  @Output() onCheckPlugiarism = new EventEmitter<number>()

  constructor(private store: Store<IAppState>) {}

  ngOnInit() {
    this.groupJobProtection$ = this.store.select(
      labsSelectors.getGroupJobProtection
    )
  }

  addLab(userId: number, labId: number, fileId: number): void {
    this.onAddFile.emit({ userId, labId, fileId })
  }

  checkPlagiarism(userLabFileId: number) {
    this.onCheckPlugiarism.emit(userLabFileId)
  }

  receiveLab(userFileId: number, userId: number): void {
    this.store.dispatch(labsActions.receiveLabFile({ userFileId, userId }))
  }

  cancelLab(userFileId: number, userId: number): void {
    this.store.dispatch(labsActions.cancelLabFile({ userFileId, userId }))
  }
  onSelectStudent(userId: number): void {
    if (userId) {
      this.selectedStudentId = userId
      this.store.dispatch(labsActions.loadStudentLabFiles({ userId }))
      this.labFiles$ = this.store.select(labsSelectors.getStudentLabFiles, {
        studentId: userId,
      })
    } else {
      this.store.dispatch(
        labsActions.resetStudentJobProtection({
          studentId: this.selectedStudentId,
        })
      )
      this.selectedStudentId = 0
    }
  }
}
