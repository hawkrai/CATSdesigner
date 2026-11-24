import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Store } from '@ngrx/store'
import { combineLatest, interval, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { SubSink } from 'subsink'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { IAppState } from 'src/app/store/state/app.state'

import * as practicalsActions from '../../../../../store/actions/practicals.actions'
import * as practicalsSelectors from '../../../../../store/selectors/practicals.selectors'
import * as subjectSelectors from '../../../../../store/selectors/subject.selector'

@Component({
  selector: 'app-student-job-protection',
  templateUrl: './student-job-protection.component.html',
  styleUrls: ['./student-job-protection.component.less'],
})
export class StudentJobProtectionComponent implements OnInit, OnDestroy {
  selectedLabId: number

  private subs = new SubSink()
  private readonly POLLING_INTERVAL = 5000

  state$: Observable<{
    practicalFiles: UserLabFile[]
    userId: number
  }>

  @Output() onAddFile = new EventEmitter<{
    userId: number
    file: UserLabFile
  }>()
  @Output() onDeleteFile = new EventEmitter<{
    userId: number
    practicalId: number
    userLabFileId: number
  }>()
  constructor(private store: Store<IAppState>) {}

  ngOnInit() {
    this.store.dispatch(practicalsActions.loadStudentFiles({}))
    this.state$ = combineLatest([
      this.store.select(subjectSelectors.getUserId),
      this.store.select(practicalsSelectors.getStudentFiles, {}),
    ]).pipe(map(([userId, practicalFiles]) => ({ practicalFiles, userId })))

    this.subs.add(
      interval(this.POLLING_INTERVAL).subscribe(() =>
        this.store.dispatch(practicalsActions.loadStudentFiles({}))
      )
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  addPractical(userId: number, file: UserLabFile): void {
    this.onAddFile.emit({ userId, file })
  }

  deletePractical(
    userLabFileId: number,
    userId: number,
    practicalId: number
  ): void {
    this.onDeleteFile.emit({ userLabFileId, userId, practicalId })
  }
}