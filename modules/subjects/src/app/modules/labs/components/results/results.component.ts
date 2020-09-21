import {Component, Input, OnInit} from '@angular/core';
import {Group} from "../../../../models/group.model";
import {LabsService} from "../../../../services/labs/labs.service";
import {select, Store} from '@ngrx/store';
import {getSubjectId, getUser} from '../../../../store/selectors/subject.selector';
import {IAppState} from '../../../../store/state/app.state';
import {getCurrentGroup} from '../../../../store/selectors/groups.selectors';
import {DialogData} from '../../../../models/dialog-data.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/typings/portal';
import {LabsMarkPopoverComponent} from './labs-mark-popover/labs-mark-popover.component';
import {LabsRestService} from '../../../../services/labs/labs-rest.service';
import {Lab, ScheduleProtectionLab} from '../../../../models/lab.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class ResultsComponent implements OnInit {

  @Input() teacher: boolean;

  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'name'];

  public selectedGroup: Group;
  private subjectId: string;
  private student: any[];
  header: any[];

  private user;

  public labProperty: {labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[]};

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              private labsRestService: LabsRestService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.pipe(select(getUser)).subscribe(user => this.user = user);
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.store.pipe(select(getCurrentGroup)).subscribe(group => {
        this.selectedGroup = group;
        this.student = null;
        this.refreshStudents();
      });
    });
  }

  refreshStudents() {
    this.labsRestService.getProtectionSchedule(this.subjectId, this.selectedGroup.groupId).subscribe(lab => {
      this.labService.getMarks(this.subjectId, this.selectedGroup.groupId).subscribe(res => {
        this.student = this.filterStudentMarks(res, lab.labs);
        this.student.forEach(lab => {
          if (!this.numberSubGroups.includes(lab.subGroup) && lab.subGroup) {
            this.numberSubGroups.push(lab.subGroup);
            this.numberSubGroups.sort((a, b) => a - b)
          }
        });
        res && this.setHeader(res[0].SubGroup, lab.labs);
        this.setSubGroupDisplayColumns();
      });
      this.labProperty = lab;
    });
  }

  setHeader(subGroup, labs: Lab[]) {
    this.header = [];
    labs = labs.filter(lab => lab.subGroup.toString() === subGroup.toString());
    labs.forEach(lab => {
      this.header.push({head: lab.labId.toString(), text: lab.shortName})
    });
  }

  setSubGroupDisplayColumns() {
    this.displayedColumns = ['position', 'name', ...this.header.map(res => res.head), 'total-lab', 'total-test', 'total'];
  }

  _getRandom() {
    return Math.floor(Math.random() * Math.floor(10000)).toString();
  }

  _getMark(student, i): number {
    return [...student.Marks.map(res => res.Mark)][i];
  }

  _getTotal(student) {
    return ((Number(student.LabsMarkTotal) + Number(student.TestMark)) / 2)
  }

  setMark(student, labId: string, recommendedMark?) {
    if (this.teacher) {
      const mark = student.Marks.find(mark => mark.LabId.toString() === labId);
      if (mark) {
        const labsMark = {
          id: mark.StudentLabMarkId ? mark.StudentLabMarkId : '0',
          comment: mark.Comment,
          mark: mark.Mark,
          date: mark.Date,
          labId: mark.LabId.toString(),
          studentId: student.StudentId.toString(),
          students: this.student
        };
        const dialogData: DialogData = {
          title: 'Выставление отметки',
          buttonText: 'Сохранить',
          body: labsMark,
          model: recommendedMark
        };
        const dialogRef = this.openDialog(dialogData, LabsMarkPopoverComponent);

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.labService.setLabsMark(labsMark)
              .subscribe(res => res.Code === '200' && this.refreshStudents());
          }
        });
      }
    }
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  private filterStudentMarks(students, labs) {
    students.map(student => {
      const marks = [];
      student.Marks.forEach(mark => {
        let contains = false;
        labs.forEach(lab => {
          if (lab.labId === mark.LabId) {
            contains = true;
          }
        });
        marks.push(mark);
      });
      student.Marks = marks;
      return student;
    });
    return students
  }
}
