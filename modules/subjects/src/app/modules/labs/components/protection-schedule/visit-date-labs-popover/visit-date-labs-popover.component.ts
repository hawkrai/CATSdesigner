import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IAppState } from 'src/app/store/state/app.state';
import { ScheduleProtectionLabs } from 'src/app/models/lab.model';
import { DialogData } from 'src/app/models/dialog-data.model';
import * as labsActions from '../../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../../store/selectors/labs.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-visit-date-labs-popover',
  templateUrl: './visit-date-labs-popover.component.html',
  styleUrls: ['./visit-date-labs-popover.component.less']
})
export class VisitDateLabsPopoverComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<VisitDateLabsPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<IAppState>
  ) { }
  schedule$: Observable<ScheduleProtectionLabs[]>;
  ngOnInit() {
    this.schedule$ = this.store.select(labsSelectors.getLabsCalendar).pipe(
      map(schedule => schedule.filter(day => day.SubGroup === this.data.body.subGroup))
    );
  }
  

  onCreateDate(date: string): void {
    this.store.dispatch(labsActions.createDateVisit({ date, subGroupId: this.data.body.subGroupId }));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onDeleteDay(day: ScheduleProtectionLabs): void {
    this.store.dispatch(labsActions.deleteDateVisit({ id: day.ScheduleProtectionLabId }));
  }

}
