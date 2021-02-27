import { LabMark } from './../../../../models/mark/lab-mark.model';
import { DialogService } from 'src/app/services/dialog.service';
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import { Lab } from '../../../../models/lab.model';
import {MarkForm} from '../../../../models/mark-form.model';
import {filter, map} from 'rxjs/operators';
import {SubSink} from 'subsink';
import { StudentMark } from 'src/app/models/student-mark.model';
import { DatePipe } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';
import * as moment from 'moment';

import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import * as subjectSelectors from '../../../../store/selectors/subject.selector';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';
import { MarkPopoverComponent } from 'src/app/shared/mark-popover/mark-popover.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class ResultsComponent implements OnInit, OnChanges, OnDestroy {
  private subs = new SubSink();
  @Input() isTeacher: boolean;
  @Input() groupId: number;

  state$: Observable<{ labs: Lab[], schedule: ScheduleProtectionLab[], students: StudentMark[], userId: number }>;

  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      this.store.dispatch(labsActions.loadLabsSchedule());
      this.store.dispatch(labsActions.loadLabStudents());
    }
  }

  ngOnInit(): void {
    this.state$ = combineLatest(
      this.store.select(labsSelectors.getLabsCalendar),
      this.store.select(labsSelectors.getLabs),
      this.store.select(labsSelectors.getLabStudents),
      this.store.select(subjectSelectors.getUserId)
    ).pipe(
      map(([schedule, labs, students, userId]) => ({ schedule, labs, students, userId }))
    );
  }

  getHeaders(subGroupLabs: Lab[]): { head: string, text: string, tooltip: string }[] {
    return subGroupLabs.map(l => ({ head: l.LabId.toString(), text: l.ShortName, tooltip: l.Theme }));
  }

  getSubGroupDisplayColumns(subGroupLabs: Lab[]): string[] {
    return ['position', 'name', ...subGroupLabs.map(l => l.LabId.toString()), 'total-lab', 'total-test', 'total'];
  }

  getTotal(student): number {
    return ((Number(student.LabsMarkTotal) + Number(student.TestMark)) / 2);
  }

  setMark(student: StudentMark, labId: string, recommendedMark: string) {
    if (!this.isTeacher) {
      return;
    }
    const mark = student.LabsMarks.find(mark => mark.LabId === +labId);
    if (mark) {
      const labsMark = this.getLabMark(mark, student.StudentId);
      const dialogData: DialogData = {
        title: 'Выставление оценки',
        buttonText: 'Сохранить',
        body: labsMark,
        model: {
          recommendedMark,
          lecturerId: mark.LecturerId
        }
      };
      const dialogRef = this.dialogService.openDialog(MarkPopoverComponent, dialogData);

      this.subs.add(dialogRef.afterClosed().pipe(
        filter(r => r),
        map((result: MarkForm) => ({
          ...labsMark,
          comment: result.comment,
          date: moment(result.date).format('DD.MM.YYYY'),
          mark: result.mark,
          showForStudent: result.showForStudent
        })),
      ).subscribe((labMark) => {
        this.store.dispatch(labsActions.setLabMark({ labMark }));
      }));

    }
  }

  getMissingTooltip(studentMark: StudentMark, schedule: ScheduleProtectionLab[]) {
    const missingSchedule = studentMark.LabVisitingMark
    .filter(visiting => schedule
      .find(schedule => schedule.ScheduleProtectionLabId === visiting.ScheduleProtectionLabId)
    ).map(visiting => ({ mark: visiting.Mark, date: schedule
      .find(schedule => schedule.ScheduleProtectionLabId === visiting.ScheduleProtectionLabId).Date}))
      .filter(sc => !!sc.mark);
    return missingSchedule.map(sc => `Пропустил(a) ${sc.mark} часа(ов).${sc.date}`).join('\n');
  }

  private getLabMark(mark: LabMark, studentId: number) {
    const dateValues = mark.Date.split('.');
    return {
      id: mark.StudentLabMarkId ? mark.StudentLabMarkId : 0,
      comment: mark.Comment,
      mark: mark.Mark,
      date: mark.Date ? new Date(+dateValues[2], +dateValues[1], +dateValues[1]) : new Date( ),
      labId: mark.LabId,
      studentId: studentId,
      showForStudent: mark.ShowForStudent
    }
  };

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(labsActions.resetLabs());
  }
}
