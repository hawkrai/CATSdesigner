import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';

import { IAppState } from 'src/app/store/state/app.state';
import { DialogData } from 'src/app/models/dialog-data.model';
import * as labsActions from '../../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../../store/selectors/labs.selectors';
import * as subjectsSelector from '../../../../../store/selectors/subject.selector';
import { map, switchMap } from 'rxjs/operators';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';
import { Lector } from 'src/app/models/lector.model';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-visit-date-labs-popover',
  templateUrl: './visit-date-labs-popover.component.html',
  styleUrls: ['./visit-date-labs-popover.component.less']
})
export class VisitDateLabsPopoverComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<VisitDateLabsPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store<IAppState>,
    private subjectsService: SubjectService
  ) { }
  
  state$: Observable<{
    schedule: ScheduleProtectionLab[],
    lectors: Lector[]
  }>;
  
  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(labsSelectors.getLabsCalendar).pipe(
        map(schedule => schedule.filter(day => day.SubGroupId === this.data.body.subGroupId))
      ),
      this.store.select(subjectsSelector.getSubjectId).pipe(
        switchMap(subjectId => this.subjectsService.getJoinedLector(subjectId, true).pipe(
          map(lectors => [...lectors].sort((a, b) => a.FullName < b.FullName ? -1: 1))
        ))
      )
    ).pipe(map(([schedule, lectors]) => ({ schedule, lectors })));

  }
  

  onCreateDate(obj: { date: string, startTime: string, endTime: string, building: string, audience: string, lecturerId }): void {
    this.store.dispatch(labsActions.createDateVisit({ obj: { ...obj, subGroupId: this.data.body.subGroupId } }));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onDeleteDay(day: ScheduleProtectionLab): void {
    this.store.dispatch(labsActions.deleteDateVisit({ id: day.ScheduleProtectionLabId }));
  }

}
