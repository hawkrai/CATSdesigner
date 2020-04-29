import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Group} from "../../../../models/group.model";
import {LabService} from "../../../../services/lab.service";
import {Lab, ScheduleProtectionLab} from "../../../../models/lab.model";
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {IAppState} from '../../../../store/state/app.state';

@Component({
  selector: 'app-protection-schedule',
  templateUrl: './protection-schedule.component.html',
  styleUrls: ['./protection-schedule.component.less']
})
export class ProtectionScheduleComponent implements OnInit, OnChanges {

  @Input() selectedGroup: Group;
  @Input() teacher: boolean;

  public labs: Lab[];
  public scheduleProtectionLabs : ScheduleProtectionLab[];
  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'theme'];

  private subjectId: string;

  constructor(private labService: LabService,
              private store: Store<IAppState>,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.labService.getProtectionSchedule(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
        this.labs = res.labs;
        this.scheduleProtectionLabs = res.scheduleProtectionLabs;
        console.log(res)
      })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedGroup && !changes.selectedGroup.firstChange) {
      this.labService.getProtectionSchedule(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
        this.labs = res.labs;
        this.scheduleProtectionLabs = res.scheduleProtectionLabs;
        this.displayedColumns.concat(this.scheduleProtectionLabs.map(res => res.date.toString()));
      })
    }
  }

  _getSubGroupLabs(i: number) {
    return this.labs.filter(res => res.subGroup === i);
  }

  _getSubGroupDay(i: number) {
    return this.scheduleProtectionLabs.filter(res => res.subGroup === i);
  }

  _getSubGroupDisplayColumns(i: number) {
    return [...this.displayedColumns, ...this._getSubGroupDay(i).map(res => res.date + res.scheduleProtectionLabId)];
  }

}
