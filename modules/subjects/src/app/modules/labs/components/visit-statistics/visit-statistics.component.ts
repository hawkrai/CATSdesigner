import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Group} from "../../../../models/group.model";
import {LabService} from "../../../../services/lab.service";
import {ActivatedRoute} from "@angular/router";
import {ScheduleProtectionLab} from "../../../../models/lab.model";
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {getSubjectId} from '../../../../store/selectors/subject.selector';

@Component({
  selector: 'app-visit-statistics',
  templateUrl: './visit-statistics.component.html',
  styleUrls: ['./visit-statistics.component.less']
})
export class VisitStatisticsComponent implements OnInit, OnChanges {

  @Input() selectedGroup: Group;
  @Input() teacher: boolean;

  public scheduleProtectionLabs: ScheduleProtectionLab[];
  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'name'];

  private subjectId: string;
  private student: any[];

  constructor(private labService: LabService,
              private store: Store<IAppState>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.labService.getProtectionSchedule(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
        this.scheduleProtectionLabs = res.scheduleProtectionLabs;
        // console.log(res)
      });
      this.labService.getMarks(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
        this.student = res;
        console.log(res)
      })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedGroup && !changes.selectedGroup.firstChange) {
      this.labService.getProtectionSchedule(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
        this.scheduleProtectionLabs = res.scheduleProtectionLabs;
        this.displayedColumns.concat(this.scheduleProtectionLabs.map(res => res.date.toString()));
      });
      this.labService.getMarks(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
        this.student = res;
      })
    }
  }

  _getStudentGroup(i: number) {
    return this.student.filter(res => res.SubGroup === i);
  }

  _getSubGroupDay(i: number) {
    return this.scheduleProtectionLabs.filter(res => res.subGroup === i);
  }

  _getSubGroupDisplayColumns(i: number) {
    return [...this.displayedColumns, ...this._getSubGroupDay(i).map(res => res.date + res.scheduleProtectionLabId)];
  }

}
