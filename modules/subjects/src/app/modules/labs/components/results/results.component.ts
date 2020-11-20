import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {MarkForm} from '../../../../models/mark-form.model';
import {Mark} from '../../../../models/mark.model';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class ResultsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  @Input() teacher: boolean;

  public numberSubGroups: number[] = [1, 2];
  public displayedColumns: string[] = ['position', 'name'];

  public selectedGroup: Group;
  private subjectId: number;
  student: any[];
  header: { head: string, text: string, tooltip: string }[];

  public labProperty: {labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[]};

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              private labsRestService: LabsRestService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.store.pipe(select(getCurrentGroup)).subscribe(group => {
        this.selectedGroup = group;
        this.student = null;
        this.refreshStudents();
      });
    });
  }

  refreshStudents(): void {
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
    this.header = labs
      .filter(lab => lab.subGroup.toString() === subGroup.toString())
      .map(l => ({ head: l.labId.toString(), text: l.shortName, tooltip: l.theme }));
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
    if (!this.teacher) {
      return;
    }
    const mark = student.Marks.find(mark => mark.LabId.toString() === labId);
    if (mark) {
      const labsMark = {
        id: mark.StudentLabMarkId ? mark.StudentLabMarkId : '0',
        comment: mark.Comment,
        mark: mark.Mark,
        date: mark.Date,
        labId: mark.LabId.toString(),
        studentId: student.StudentId,
        students: this.student
      };
      const dialogData: DialogData = {
        title: 'Выставление отметки',
        buttonText: 'Сохранить',
        body: labsMark,
        model: recommendedMark
      };
      const dialogRef = this.openDialog(dialogData, LabsMarkPopoverComponent);

      this.subs.add(dialogRef.afterClosed().pipe(
        map((result: MarkForm) => ({
          ...labsMark,
          comment: result.comment,
          lecturerId: result.lector,
          date: result.date,
          mark: result.mark
        })),
        switchMap(labsMark => this.labService.setLabsMark(labsMark))
      ).subscribe((result ) => {
        if (result.Code === '200') {
          this.refreshStudents();
        }
      }));

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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
