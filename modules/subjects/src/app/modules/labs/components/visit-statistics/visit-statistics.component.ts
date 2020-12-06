import { SubSink } from 'subsink';
import {select, Store} from '@ngrx/store';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { StudentMark } from './../../../../models/student-mark.model';
import {LabsService} from "../../../../services/labs/labs.service";
import { Lab, ScheduleProtectionLabs } from '../../../../models/lab.model';
import {IAppState} from '../../../../store/state/app.state';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {getCurrentGroup} from '../../../../store/selectors/groups.selectors';
import {DialogData} from '../../../../models/dialog-data.model';
import {VisitingPopoverComponent} from '../../../../shared/visiting-popover/visiting-popover.component';
import {Group} from '../../../../models/group.model';
import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';


@Component({
  selector: 'app-visit-statistics',
  templateUrl: './visit-statistics.component.html',
  styleUrls: ['./visit-statistics.component.less']
})
export class VisitStatisticsComponent implements OnInit, OnDestroy {

  @Input() isTeacher: boolean;
  private subs = new SubSink();
  public scheduleProtectionLabs: ScheduleProtectionLabs[];
  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'name'];

  private subjectId: number;
  private group: Group;
  student: StudentMark[];

  public labs: Lab[];
  public header: { head:string, text: string, length: number, tooltip?: string }[];
  public displayColumnsLab = [];

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              public dialog: MatDialog) {
  }

  ngOnDestroy(): void {
     this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.add(
      this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
        this.subjectId = subjectId;
  
        this.subs.add(
          this.store.pipe(select(getCurrentGroup)).subscribe(group => {
            this.group = group;
            this.store.dispatch(labsActions.loadLabsSchedule());
            this.subs.add(
              this.store.select(labsSelectors.getLabs).subscribe(res => {
                this.labs = res;
              })
            );
    
            this.subs.add(
              this.store.select(labsSelectors.getLabsCalendar).subscribe(res => {
                this.scheduleProtectionLabs = res;
                this.scheduleProtectionLabs.forEach(lab => {
                  if (!this.numberSubGroups.includes(lab.SubGroup)) {
                    this.numberSubGroups.push(lab.SubGroup);
                    this.numberSubGroups.sort((a, b) => a - b);
                  }
                });
              })
            );
            this.refreshMarks();
          })
        );
      })
    );
  }

  refreshMarks() {
    this.subs.add(
      this.labService.getMarks(this.subjectId, this.group.GroupId).subscribe(res => {
        this.student = res;
        this.setSubGroupDisplayColumnsLab(res[0].SubGroup);
      })
    );
  }


  _getStudentGroup(i: number) {
    return this.student.filter(res => res.SubGroup === i);
  }

  _getSubGroupDay(i: number) {
    return this.scheduleProtectionLabs.filter(res => res.SubGroup === i);
  }

  _getSubGroupDisplayColumns(i: number) {
    return [...this.displayedColumns, ...this._getSubGroupDay(i).map(res => res.Date + res.ScheduleProtectionLabId)];
  }

  setVisitMarks(date: ScheduleProtectionLabs, index) {
    if (this.isTeacher) {
      const students = this._getStudentGroup(date.SubGroup);
      const visits = {date: date.Date, students: []};
      students.forEach(student => {
        const visit = {
          name: student.FullName,
          mark: student.LabVisitingMark[index].Mark,
          comment: student.LabVisitingMark[index].Comment
        };
        visits.students.push(visit);
      });

      const dialogData: DialogData = {
        title: 'Посещаемость занятий',
        buttonText: 'Сохранить',
        body: visits
      };
      const dialogRef = this.openDialog(dialogData, VisitingPopoverComponent);

      this.subs.add(
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const visitsModel = {Id: [], comments: [], dateId: date.ScheduleProtectionLabId, marks: [], students, studentsId: []};
            this.labService.setLabsVisitingDate(this.getModelVisitLabs(students, index, visitsModel, result.students))
              .subscribe(res => res.Code === '200' && this.refreshMarks());
          }
        })
      );
    }
  }

  getModelVisitLabs(students, index, visitsModel, visits) {
    students.forEach(student => {
      visitsModel.Id.push(student.LabVisitingMark[index].LabVisitingMarkId);
      visitsModel.studentsId.push(student.StudentId);
    });
    visits.forEach(visit => {
      visitsModel.marks.push(visit.mark ? visit.mark.toString() : '');
      visitsModel.comments.push(visit.comment);
    });
    return visitsModel
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  setSubGroupDisplayColumnsLab(subGroup: number) {
    this.header = [{head: 'emptyPosition', text: '', length: 1}, {head: 'emptyName', text: '', length: 1}];
    const labs = this.labs.filter(lab => lab.SubGroup === subGroup);
    labs.forEach(lab => {
      this.header.push({head: lab.LabId.toString(), text: lab.ShortName, length: Math.floor(lab.Duration / 2), tooltip: lab.Theme });
    });
    this.displayColumnsLab = this.header.map(res => res.head);
  }

}
