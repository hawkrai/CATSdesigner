import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { IAppState } from 'src/app/store/state/app.state'

import * as practicalsActions from '../../../../../store/actions/practicals.actions'
import * as practicalsSelectors from '../../../../../store/selectors/practicals.selectors'

@Component({
  selector: 'app-teacher-job-protection',
  templateUrl: './teacher-job-protection.component.html',
  styleUrls: ['./teacher-job-protection.component.less'],
})
export class TeacherJobProtectionComponent implements OnInit {
  groupJobProtection$: Observable<GroupJobProtection>
  practicalFiles$: Observable<UserLabFile[]>

  selectedStudentId: number

  @Output() onAddFile = new EventEmitter<{
    userId: number
    practicalId: number
    fileId: number
  }>()
  @Output() onCheckPlugiarism = new EventEmitter<number>()

  constructor(private store: Store<IAppState>) {}

  ngOnInit() {
    this.groupJobProtection$ = this.store.select(
      practicalsSelectors.getGroupJobProtection
    )
  }

  addPractical(userId: number, practicalId: number, fileId: number): void {
    this.onAddFile.emit({ userId, practicalId, fileId })
  }

  checkPlagiarism(userLabFileId: number) {
    this.onCheckPlugiarism.emit(userLabFileId)
  }

  receivePractical(userFileId: number, userId: number): void {
    this.store.dispatch(practicalsActions.receiveFile({ userFileId, userId }))
  }

  cancelPractical(userFileId: number, userId: number): void {
    this.store.dispatch(practicalsActions.cancelFile({ userFileId, userId }))
  }
  onSelectStudent(userId: number): void {
    if (userId) {
      this.selectedStudentId = userId
      this.store.dispatch(practicalsActions.loadStudentFiles({ userId }))
      this.practicalFiles$ = this.store.select(
        practicalsSelectors.getStudentFiles,
        { studentId: userId }
      )
    } else {
      this.store.dispatch(
        practicalsActions.resetStudentJobProtection({
          studentId: this.selectedStudentId,
        })
      )
      this.selectedStudentId = 0
    }
  }
}
