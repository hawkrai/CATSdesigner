import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Group} from "../../../../models/group.model";
import {LabsService} from "../../../../services/labs/labs.service";
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {IAppState} from '../../../../store/state/app.state';
import {getCurrentGroup} from '../../../../store/selectors/groups.selectors';
import {DialogData} from '../../../../models/dialog-data.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/typings/portal';
import {LabsMarkPopoverComponent} from './labs-mark-popover/labs-mark-popover.component';
import {LabsRestService} from '../../../../services/labs/labs-rest.service';
import { Lab, ScheduleProtectionLabs } from '../../../../models/lab.model';
import {MarkForm} from '../../../../models/mark-form.model';
import {filter, map, switchMap} from 'rxjs/operators';
import {SubSink} from 'subsink';
import { StudentMark } from 'src/app/models/student-mark.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class ResultsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  @Input() teacher: boolean;

  public selectedGroup: Group;
  private subjectId: number;
  students: StudentMark[];
  displayedColumns: string[] = ['position', 'name'];
  header: { head: string, text: string, tooltip: string }[];

  public labProperty: {labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLabs[]};

  constructor(private labService: LabsService,
              private store: Store<IAppState>,
              private labsRestService: LabsRestService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.subs.add(
      this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
        this.subjectId = subjectId; 
        this.subs.add(
          this.store.pipe(select(getCurrentGroup)).subscribe(group => {
            this.selectedGroup = group;
            this.students = null;
            this.refreshStudents();
          })
        );
      })
    );

  }

  refreshStudents(): void {
    this.subs.add(
      this.labsRestService.getProtectionSchedule(this.subjectId, this.selectedGroup.GroupId).subscribe(lab => {
        this.subs.add(
          this.labService.getMarks(this.subjectId, this.selectedGroup.GroupId).subscribe(res => {
            this.students = res;
            res && this.setHeader(res[0].SubGroup, lab.labs);
            this.setSubGroupDisplayColumns();
          })
        );
        this.labProperty = lab;
      })
    );
  }

  getSubGroups(students: StudentMark[]): number[] {
    return [...new Set(students.map(s => s.SubGroup))].sort((a, b) => a - b);
  }

  setHeader(subGroup: number, labs: Lab[]) {
    this.header = labs
      .filter(lab => lab.SubGroup === subGroup)
      .map(l => ({ head: l.LabId.toString(), text: l.ShortName, tooltip: l.Theme }));
  }

  setSubGroupDisplayColumns() {
    this.displayedColumns = ['position', 'name', ...this.header.map(res => res.head), 'total-lab', 'total-test', 'total'];
  }

  getTotal(student) {
    return ((Number(student.LabsMarkTotal) + Number(student.TestMark)) / 2)
  }

  setMark(student: StudentMark, labId: string, recommendedMark?) {
    if (!this.teacher) {
      return;
    }
    const mark = student.Marks.find(mark => mark.LabId.toString() === labId);
    if (mark) {
      const dateValues = mark.Date.split('.');
      const labsMark = {
        id: mark.StudentLabMarkId ? mark.StudentLabMarkId : '0',
        comment: mark.Comment,
        mark: mark.Mark,
        date: mark.Date ? new Date(+dateValues[2], +dateValues[1], +dateValues[1]) : new Date( ),
        labId: mark.LabId.toString(),
        studentId: student.StudentId,
      };
      console.log(labsMark.date);
      const dialogData: DialogData = {
        title: 'Выставление оценки',
        buttonText: 'Сохранить',
        body: labsMark,
        model: {
          recommendedMark,
          lecturerId: mark.LecturerId
        }
      };
      const dialogRef = this.openDialog(dialogData, LabsMarkPopoverComponent);

      this.subs.add(dialogRef.afterClosed().pipe(
        filter(r => r),
        map((result: MarkForm) => ({
          ...labsMark,
          comment: result.comment,
          date: new DatePipe('en-US').transform(result.date, 'dd.mm.yyyy'),
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

  getMissingTooltip(studentMark: StudentMark) {
    const missingSchedule = studentMark.LabVisitingMark
    .filter(visiting => this.labProperty.scheduleProtectionLabs
      .find(schedule => schedule.ScheduleProtectionLabId === visiting.ScheduleProtectionLabId)
    ).map(visiting => ({ mark: visiting.Mark, date: this.labProperty.scheduleProtectionLabs
      .find(schedule => schedule.ScheduleProtectionLabId === visiting.ScheduleProtectionLabId).Date}))
      .filter(sc => !!sc.mark);
    return missingSchedule.map(sc => `Пропустил(a) ${sc.mark} часа(ов).${sc.date}`).join('\n');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
