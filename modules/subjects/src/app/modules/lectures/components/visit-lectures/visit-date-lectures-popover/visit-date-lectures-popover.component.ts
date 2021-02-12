import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Calendar } from 'src/app/models/calendar.model';
import { DialogData } from 'src/app/models/dialog-data.model';
import { IAppState } from 'src/app/store/state/app.state';
import * as lecturesSelectors from '../../../../../store/selectors/lectures.selectors';
import * as lecturesActions from '../../../../../store/actions/lectures.actions';


@Component({
  selector: 'app-visit-date-lectures-popover',
  templateUrl: './visit-date-lectures-popover.component.html',
  styleUrls: ['./visit-date-lectures-popover.component.less']
})
export class VisitDateLecturesPopoverComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<VisitDateLecturesPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<IAppState>
  ) { }
  schedule$: Observable<Calendar[]>;
  ngOnInit() {
    this.schedule$ = this.store.select(lecturesSelectors.getCalendar);
  }

  onCreateDate(obj: { date: string, startTime: string, endTime: string, building: string, audience: string }): void {
    this.store.dispatch(lecturesActions.createDateVisit({ obj }));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onDeleteDay(day: Calendar): void {
    this.store.dispatch(lecturesActions.deleteDateVisit({ id: day.Id }));
  }
}
