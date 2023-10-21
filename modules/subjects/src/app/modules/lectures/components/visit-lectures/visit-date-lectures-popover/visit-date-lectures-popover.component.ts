import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Store } from '@ngrx/store'
import { combineLatest, Observable } from 'rxjs'

import { Calendar } from 'src/app/models/calendar.model'
import { DialogData } from 'src/app/models/dialog-data.model'
import { IAppState } from 'src/app/store/state/app.state'
import * as lecturesSelectors from '../../../../../store/selectors/lectures.selectors'
import * as subjectsSelector from '../../../../../store/selectors/subject.selector'
import * as lecturesActions from '../../../../../store/actions/lectures.actions'
import { Lector } from 'src/app/models/lector.model'
import { SubjectService } from 'src/app/services/subject.service'
import { map, switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-visit-date-lectures-popover',
  templateUrl: './visit-date-lectures-popover.component.html',
  styleUrls: ['./visit-date-lectures-popover.component.less'],
})
export class VisitDateLecturesPopoverComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<VisitDateLecturesPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<IAppState>,
    private subjectsService: SubjectService
  ) {}

  state$: Observable<{
    schedule: Calendar[]
    lectors: Lector[]
  }>

  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(lecturesSelectors.getCalendar),
      this.store
        .select(subjectsSelector.getSubjectId)
        .pipe(
          switchMap((subjectId) =>
            this.subjectsService
              .getJoinedLector(subjectId, true)
              .pipe(
                map((lectors) =>
                  [...lectors].sort((a, b) =>
                    a.FullName < b.FullName ? -1 : 1
                  )
                )
              )
          )
        )
    ).pipe(map(([schedule, lectors]) => ({ schedule, lectors })))
  }

  onCreateDate(obj: {
    date: string
    startTime: string
    endTime: string
    building: string
    audience: string
    lecturerId: number
  }): void {
    this.store.dispatch(lecturesActions.createDateVisit({ obj }))
  }

  onClose(): void {
    this.dialogRef.close()
  }

  onDeleteDay(day: Calendar): void {
    this.store.dispatch(lecturesActions.deleteDateVisit({ id: day.Id }))
  }
}
