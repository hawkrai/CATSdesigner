import { SubSink } from 'subsink';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Lab, ScheduleProtectionLabs } from "../../../../models/lab.model";
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as groupSelectors from '../../../../store/selectors/groups.selectors';
import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import { VisitDateLabsPopoverComponent } from './visit-date-labs-popover/visit-date-labs-popover.component';

@Component({
  selector: 'app-protection-schedule',
  templateUrl: './protection-schedule.component.html',
  styleUrls: ['./protection-schedule.component.less']
})
export class ProtectionScheduleComponent implements OnInit, OnDestroy, OnChanges {

  @Input() isTeacher: boolean;
  private subs = new SubSink();
  public labs: Lab[];
  public scheduleProtectionLabs: ScheduleProtectionLabs[];
  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'theme'];
  public subGroupIds: number[] = [];


  constructor(
              private store: Store<IAppState>,
              public dialog: MatDialog) {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit() {
    this.store.dispatch(labsActions.loadLabsSchedule());

    this.subs.add(
      this.store.select(labsSelectors.getLabsCalendar).subscribe(res => {
        this.scheduleProtectionLabs = res;
        this.scheduleProtectionLabs.forEach(lab => {
          if (!this.numberSubGroups.includes(lab.SubGroup)) {
            this.numberSubGroups.push(lab.SubGroup);
            this.numberSubGroups.sort((a, b) => a-b)
          }
        });
      })
    );

    this.subs.add(
      this.store.select(groupSelectors.getCurrentGroupSubGroupIds).subscribe(res => {
        this.subGroupIds = res;
      })
    );

    this.subs.add(
      this.store.select(labsSelectors.getLabs).subscribe(res => {
        this.labs = res;
     })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  _getSubGroupLabs(i: number) {
    return this.labs.filter(res => res.SubGroup === i);
  }

  _getSubGroupDay(i: number) {
    return this.scheduleProtectionLabs.filter(res => res.SubGroup === i);
  }

  _getSubGroupDisplayColumns(i: number) {
    return [...this.displayedColumns, ...this._getSubGroupDay(i).map(res => res.Date + res.ScheduleProtectionLabId)];
  }

  settingVisitDate(index: number) {
    const dialogData: DialogData = {
      title: 'Даты занятий',
      buttonText: 'Добавить',
      body: { subGroupId: this.getSubGroupId(index), subGroup: index },
    };

    this.openDialog(dialogData, VisitDateLabsPopoverComponent);
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  private getSubGroupId(i) {
    return this.subGroupIds[i - 1];
  }

}
