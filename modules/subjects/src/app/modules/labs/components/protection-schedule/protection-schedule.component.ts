import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import {Store} from '@ngrx/store';
import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { Lab } from "../../../../models/lab.model";
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import * as groupSelectors from '../../../../store/selectors/groups.selectors';
import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import * as subjectSelectors from '../../../../store/selectors/subject.selector';
import { VisitDateLabsPopoverComponent } from './visit-date-labs-popover/visit-date-labs-popover.component';
import { DialogService } from 'src/app/services/dialog.service';
import { map, tap } from 'rxjs/operators';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';
import { TranslatePipe } from 'educats-translate';
import { SubSink } from 'subsink';
import { SubGroup } from 'src/app/models/sub-group.model';

@Component({
  selector: 'app-protection-schedule',
  templateUrl: './protection-schedule.component.html',
  styleUrls: ['./protection-schedule.component.less']
})
export class ProtectionScheduleComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  state$: Observable<{ labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[], isTeacher: boolean, subGroups: SubGroup[] }>;
  public displayedColumns: string[] = ['position', 'theme'];
  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe,
    private dialogService: DialogService) {
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(labsActions.resetLabs());
  }

  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(labsSelectors.getLabs),
      this.store.select(labsSelectors.getLabsCalendar),
      this.store.select(labsSelectors.getSubGroups),
      this.store.select(subjectSelectors.isTeacher)
    ).pipe(
      map(([labs, scheduleProtectionLabs, subGroups, isTeacher]) => ({ labs, scheduleProtectionLabs, subGroups, isTeacher }))
    );

    this.subs.add(
      this.store.select(groupSelectors.getCurrentGroup).subscribe((group) => {
        if (group) {
          this.store.dispatch(labsActions.loadLabsSchedule());
        }
      })
    );
  }

  getSubGroupDisplayColumns(schedule: ScheduleProtectionLab[]) {
    return [...this.displayedColumns, ...schedule.map(res => res.Date + res.ScheduleProtectionLabId)];
  }

  settingVisitDate(subGroup: number, subGroupId: number) {
    const dialogData: DialogData = {
      title: this.translate.transform('text.schedule.dates', 'Даты занятий'),
      buttonText: this.translate.transform('button.add', 'Добавить'),
      body: { subGroupId, subGroup },
    };

    this.dialogService.openDialog(VisitDateLabsPopoverComponent, dialogData);
  }

}
