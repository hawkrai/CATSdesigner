import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DialogData } from 'src/app/models/dialog-data.model';
import { Lector } from 'src/app/models/lector.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { SubjectService } from 'src/app/services/subject.service';
import { IAppState } from 'src/app/store/state/app.state';
import * as practicalsActions from '../../../../../store/actions/practicals.actions';
import * as practicalsSelectors from '../../../../../store/selectors/practicals.selectors';
import * as subjectsSelector from '../../../../../store/selectors/subject.selector';

@Component({
  selector: 'app-visit-date-practicals-popover',
  templateUrl: './visit-date-practicals-popover.component.html',
  styleUrls: ['./visit-date-practicals-popover.component.less']
})
export class VisitDatePracticalsPopoverComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<VisitDatePracticalsPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<IAppState>,
    private subjectsService: SubjectService
  ) { }
  
  state$: Observable<{
    schedule: ScheduleProtectionPractical[],
    lectors: Lector[]
  }>;
  
  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(practicalsSelectors.selectSchedule),
      this.store.select(subjectsSelector.getSubjectId).pipe(
        switchMap(subjectId => this.subjectsService.getJoinedLector(subjectId, true).pipe(
          map(lectors => [...lectors].sort((a, b) => a.FullName < b.FullName ? -1: 1))
        ))
      )
    ).pipe(map(([schedule, lectors]) => ({ schedule, lectors })));

  }

  onCreateDate(obj: { date: string, startTime: string, endTime: string, building: string, audience: string, lecturerId: number }): void {
    this.store.dispatch(practicalsActions.createDateVisit({ obj }));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onDeleteDay(day: ScheduleProtectionPractical): void {
    this.store.dispatch(practicalsActions.deleteDateVisit({ id: day.ScheduleProtectionPracticalId }));
  }
}
