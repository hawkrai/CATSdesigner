import {Component, Input, OnInit} from '@angular/core';
import {LabsService} from "../../../../services/labs/labs.service";
import {Lab, ScheduleProtectionLab} from "../../../../models/lab.model";
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {getCurrentGroup} from '../../../../store/selectors/groups.selectors';
import {DialogData} from '../../../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {VisitingPopoverComponent} from '../../../../shared/visiting-popover/visiting-popover.component';
import {Group} from '../../../../models/group.model';

@Component({
  selector: 'app-visit-statistics',
  templateUrl: './visit-statistics.component.html',
  styleUrls: ['./visit-statistics.component.less']
})
export class VisitStatisticsComponent implements OnInit {

  @Input() teacher: boolean;

  public scheduleProtectionLabs: ScheduleProtectionLab[];
  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'name'];

  private subjectId: string;
  private group: Group;
  private student: any[];

  public labs: Lab[];
  public  header = [{head: 'empty', text: '', length: 2}];
  public displayColumnsLab = [];

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.store.pipe(select(getCurrentGroup)).subscribe(group => {
        this.group = group;
        this.labService.loadData();

        this.labService.getLabsProtectionSchedule().subscribe(res => {
          this.labs = res;
        });

        this.labService.getCalendar().subscribe(res => {
          this.scheduleProtectionLabs = res;
          this.scheduleProtectionLabs.forEach(lab => {
            if (!this.numberSubGroups.includes(lab.subGroup)) {
              this.numberSubGroups.push(lab.subGroup);
              this.numberSubGroups.sort((a, b) => a-b)
            }
          });
        });

        this.refreshMarks();
      });
    });
  }

  refreshMarks() {
    this.labService.getMarks(this.subjectId, this.group.groupId).subscribe(res => {
      this.student = res;
      this.setSubGroupDisplayColumnsLab(res[0].SubGroup);
    })
  }


  _getStudentGroup(i: number) {
    return this.student.filter(res => res.SubGroup === i);
  }

  _getSubGroupDay(i: number) {
    return this.scheduleProtectionLabs.filter(res => res.subGroup === i);
  }

  _getSubGroupDisplayColumns(i: number) {
    return [...this.displayedColumns, ...this._getSubGroupDay(i).map(res => res.date + res.id)];
  }

  setVisitMarks(date: ScheduleProtectionLab, index) {
    if (this.teacher) {
      const students = this._getStudentGroup(date.subGroup);
      const visits = {date: date.date, students: []};
      students.forEach(student => {
        const visit = {
          name: student.FullName,
          mark: student.LabVisitingMark[index].Mark,
          comment: student.LabVisitingMark[index].Comment
        };
        visits.students.push(visit);
      });

      const dialogData: DialogData = {
        title: 'Посещаемость студентов',
        buttonText: 'Сохранить',
        body: visits
      };
      const dialogRef = this.openDialog(dialogData, VisitingPopoverComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const visitsModel = {Id: [], comments: [], dateId: date.id, marks: [], students, studentsId: []};
          this.labService.setLabsVisitingDate(this.getModelVisitLabs(students, index, visitsModel, result.students))
            .subscribe(res => res.Code === '200' && this.refreshMarks());
        }
      });
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

  setSubGroupDisplayColumnsLab(subGroup) {
    this.header = [{head: 'emptyPosition', text: '', length: 1}, {head: 'emptyName', text: '', length: 1}];
    const labs = this.labs.filter(lab => lab.subGroup.toString() === subGroup.toString());
    console.log(labs)
    labs.forEach(lab => {
      this.header.push({head: lab.labId.toString(), text: lab.shortName, length: Math.floor(lab.duration/2)})
    });
    this.displayColumnsLab = this.header.map(res => res.head);
  }

}
