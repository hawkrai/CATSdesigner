import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DialogData } from 'src/app/models/dialog-data.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { ScheduleProtection } from 'src/app/models/schedule-protection/schedule-protection.model';
import { IAppState } from 'src/app/store/state/app.state';
import * as practicalsActions from '../../../../../store/actions/practicals.actions';
import * as practicalsSelectors from '../../../../../store/selectors/practicals.selectors';

@Component({
  selector: 'app-visit-date-practicals-popover',
  templateUrl: './visit-date-practicals-popover.component.html',
  styleUrls: ['./visit-date-practicals-popover.component.less']
})
export class VisitDatePracticalsPopoverComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<VisitDatePracticalsPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<IAppState>
  ) { }
  schedule$: Observable<ScheduleProtectionPractical[]>;
  
  ngOnInit() {
    this.schedule$ = this.store.select(practicalsSelectors.selectSchedule);
  }
  

  onCreateDate(obj: { date: string, startTime: string, endTime: string, building: string, audience: string }): void {
    this.store.dispatch(practicalsActions.createDateVisit({ obj }));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onDeleteDay(day: ScheduleProtectionPractical): void {
    this.store.dispatch(practicalsActions.deleteDateVisit({ id: day.ScheduleProtectionPracticalId }));
  }
}
