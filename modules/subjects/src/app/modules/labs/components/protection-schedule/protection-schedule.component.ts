import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Lab } from "../../../../models/lab.model";
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import * as groupSelectors from '../../../../store/selectors/groups.selectors';
import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import { VisitDateLabsPopoverComponent } from './visit-date-labs-popover/visit-date-labs-popover.component';
import { DialogService } from 'src/app/services/dialog.service';
import { map, tap } from 'rxjs/operators';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';

@Component({
  selector: 'app-protection-schedule',
  templateUrl: './protection-schedule.component.html',
  styleUrls: ['./protection-schedule.component.less']
})
export class ProtectionScheduleComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isTeacher: boolean;
  @Input() groupId: number;

  state$: Observable<{ labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[], subGroupsIds: number[] }>;
  public displayedColumns: string[] = ['position', 'theme'];
  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService) {
  }
  ngOnDestroy(): void {
    this.store.dispatch(labsActions.resetLabs());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      this.store.dispatch(labsActions.loadLabsSchedule());
    }
  }

  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(labsSelectors.getLabs),
      this.store.select(labsSelectors.getLabsCalendar),
      this.store.select(groupSelectors.getCurrentGroupSubGroupIds)
    ).pipe(
      map(([labs, scheduleProtectionLabs, subGroupsIds]) => ({ labs, scheduleProtectionLabs, subGroupsIds }))
    )
  }

  getSubGroupDisplayColumns(schedule: ScheduleProtectionLab[]) {
    return [...this.displayedColumns, ...schedule.map(res => res.Date + res.ScheduleProtectionLabId)];
  }

  settingVisitDate(subGroup: number, subGroupId: number) {
    const dialogData: DialogData = {
      title: 'Даты занятий',
      buttonText: 'Добавить',
      body: { subGroupId, subGroup },
    };

    this.dialogService.openDialog(VisitDateLabsPopoverComponent, dialogData);
  }

}
