import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Store } from '@ngrx/store'
import { interval, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { SubSink } from 'subsink'
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
export class TeacherJobProtectionComponent implements OnInit, OnDestroy {
  groupJobProtection$: Observable<GroupJobProtection>
  practicalFiles$: Observable<UserLabFile[]>

  selectedStudentId: number

  private subs = new SubSink()
  private readonly POLLING_INTERVAL = 5000

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

    this.subs.add(
      interval(this.POLLING_INTERVAL)
        .pipe(filter(() => !!this.selectedStudentId))
        .subscribe(() =>
          this.store.dispatch(
            practicalsActions.loadStudentFiles({
              userId: this.selectedStudentId,
            })
          )
        )
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
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

  hasWordFile(attachments: { FileName: string }[]): boolean {
    return attachments.some(
      (a) =>
        a.FileName.toLowerCase().endsWith('.doc') ||
        a.FileName.toLowerCase().endsWith('.docx')
    )
  }
}