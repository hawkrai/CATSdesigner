import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Group} from "../../../../models/group.model";
import {LabsService} from "../../../../services/labs/labs.service";
import {Lab, ScheduleProtectionLab} from "../../../../models/lab.model";
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {VisitDatePopoverComponent} from '../../../../shared/visit-date-popover/visit-date-popover.component';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {getCurrentGroup} from '../../../../store/selectors/groups.selectors';

@Component({
  selector: 'app-protection-schedule',
  templateUrl: './protection-schedule.component.html',
  styleUrls: ['./protection-schedule.component.less']
})
export class ProtectionScheduleComponent implements OnInit {

  @Input() teacher: boolean;

  public labs: Lab[];
  public scheduleProtectionLabs: ScheduleProtectionLab[];
  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'theme'];

  private subjectId: string;

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.store.pipe(select(getCurrentGroup)).subscribe(group => {
        this.labService.loadDate();
        this.labService.getCalendar().subscribe(res => {
          this.scheduleProtectionLabs = res;
        });
        this.labService.getLabsProtectionSchedule().subscribe(res => {
          this.labs = res;
        })
      });
    });
  }

  _getSubGroupLabs(i: number) {
    return this.labs.filter(res => res.subGroup === i);
  }

  _getSubGroupDay(i: number) {
    return this.scheduleProtectionLabs.filter(res => res.subGroup === i);
  }

  _getSubGroupDisplayColumns(i: number) {
    return [...this.displayedColumns, ...this._getSubGroupDay(i).map(res => res.date + res.id)];
  }

  settingVisitDate(index) {
    const dialogData: DialogData = {
      title: 'График посещения',
      buttonText: 'Добавить',
      body: {service: this.labService, restBody: {subGroupId: this.getSubGroupId(index)}},
      model: index
    };

    this.openDialog(dialogData, VisitDatePopoverComponent);
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  private getSubGroupId(i) {
    return this.scheduleProtectionLabs.find(res => res.subGroup === i).subGroupId;
  }

}
