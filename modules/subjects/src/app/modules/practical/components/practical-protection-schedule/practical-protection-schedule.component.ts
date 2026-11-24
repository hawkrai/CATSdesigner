import { combineLatest, interval, Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { Component, OnInit, OnDestroy, Input } from '@angular/core'

import { Practical } from 'src/app/models/practical.model'
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model'
import { IAppState } from 'src/app/store/state/app.state'
import * as practicalsSelectors from '../../../../store/selectors/practicals.selectors'
import * as practicalsActions from '../../../../store/actions/practicals.actions'
import * as groupsSelectors from '../../../../store/selectors/groups.selectors'
import * as subjectSelectors from '../../../../store/selectors/subject.selector'
import { filter, map } from 'rxjs/operators'
import { DialogService } from 'src/app/services/dialog.service'
import { DialogData } from 'src/app/models/dialog-data.model'
import { VisitDatePracticalsPopoverComponent } from './visit-date-practicals-popover/visit-date-practicals-popover.component'
import { TranslatePipe } from 'educats-translate'
import { SubSink } from 'subsink'

@Component({
  selector: 'app-practical-protection-schedule',
  templateUrl: './practical-protection-schedule.component.html',
  styleUrls: ['./practical-protection-schedule.component.less'],
})
export class PracticalProtectionScheduleComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['position', 'theme']
  private readonly POLLING_INTERVAL = 5000
  private hasGroup = false
  private dialogOpen = false
  private subs = new SubSink()
  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService,
    private translate: TranslatePipe
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  state$: Observable<{
    practicals: Practical[]
    schedule: ScheduleProtectionPractical[]
    isTeacher: boolean
  }>

  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(practicalsSelectors.selectPracticals),
      this.store.select(practicalsSelectors.selectSchedule),
      this.store.select(subjectSelectors.isTeacher)
    ).pipe(
      map(([practicals, schedule, isTeacher]) => ({
        practicals,
        schedule,
        isTeacher,
      }))
    )

        this.subs.add(
      this.store.select(groupsSelectors.getCurrentGroup).subscribe((group) => {
        this.hasGroup = !!group
        if (group) {
          this.store.dispatch(practicalsActions.loadSchedule())
        }
      })
    )

    this.subs.add(
      interval(this.POLLING_INTERVAL)
        .pipe(filter(() => this.hasGroup && !this.dialogOpen))
        .subscribe(() => {
          this.store.dispatch(practicalsActions.loadSchedule())
        })
    )
  }

  getDisplayedColumns(schedule: ScheduleProtectionPractical[]): string[] {
    return [
      ...this.displayedColumns,
      ...schedule.map((res) => res.Date + res.ScheduleProtectionPracticalId),
    ]
  }

    settingVisitDate() {
    const dialogData: DialogData = {
      title: this.translate.transform('text.schedule.dates', 'Даты занятий'),
      buttonText: this.translate.transform('button.add', 'Добавить'),
    }

    this.dialogOpen = true
    const dialogRef = this.dialogService.openDialog(
      VisitDatePracticalsPopoverComponent,
      dialogData
    )
    this.subs.add(
      dialogRef.afterClosed().subscribe(() => {
        this.dialogOpen = false
        this.store.dispatch(practicalsActions.loadSchedule())
      })
    )
  }
}
