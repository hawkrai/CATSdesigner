import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { filter, map } from 'rxjs/operators';
import {Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { StudentMark } from './../../../../models/student-mark.model';
import { Lab } from '../../../../models/lab.model';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {VisitingPopoverComponent} from '../../../../shared/visiting-popover/visiting-popover.component';
import { DialogService } from 'src/app/services/dialog.service';
import * as groupsSelectors from '../../../../store/selectors/groups.selectors';
import * as catsActions from '../../../../store/actions/cats.actions';
import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import * as subjectSelectors from '../../../../store/selectors/subject.selector';
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model';
import { Message } from 'src/app/models/message.model';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-visit-statistics',
  templateUrl: './visit-statistics.component.html',
  styleUrls: ['./visit-statistics.component.less']
})
export class VisitStatisticsComponent implements OnInit,  OnDestroy {
  private subs = new SubSink();
  state$: Observable<{ labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLab[], students: StudentMark[], userId: number, isTeacher: boolean, subGroups: number[] }>;
  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe,
    public dialogService: DialogService) {
  } 

  ngOnDestroy(): void {
     this.subs.unsubscribe();
     this.store.dispatch(labsActions.resetLabs());
  }

  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(labsSelectors.getLabs),
      this.store.select(labsSelectors.getLabsCalendar),
      this.store.select(labsSelectors.getLabStudents),
      this.store.select(subjectSelectors.getUserId),
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(labsSelectors.getSubGroups)
    ).pipe(
      map(([labs, scheduleProtectionLabs, students, userId, isTeacher, subGroups]) => ({ labs, scheduleProtectionLabs, students, userId, isTeacher, subGroups: subGroups.map(x => x.SubGroupValue) }))
    );

    this.subs.add(
      this.store.select(groupsSelectors.getCurrentGroup).subscribe(group => {
        if (group) {
          this.store.dispatch(labsActions.loadLabsSchedule());
          this.store.dispatch(labsActions.loadLabStudents());
        }
      })
    );
  }


  getSubGroupDisplayColumns(schedule: ScheduleProtectionLab[]) {
    const defaultColumns = ['position', 'name'];
    return [...defaultColumns,  ...schedule.map(res => res.Date + res.ScheduleProtectionLabId)];
  }


  getSubGroupHeaders(subGroupLabs: Lab[]): { head: string, text: string, length: number, tooltip?: string }[] {
    const defaultHeaders = [{ head: 'emptyPosition', text: '', length: 1 }, { head: 'emptyName', text: '', length: 1 }];
    return defaultHeaders.concat(subGroupLabs.map((l, index) => ({head: l.LabId.toString(), text: l.ShortName, length: Math.floor(l.Duration / 2), tooltip: l.Theme })))
  }

  setVisitMarks(students: StudentMark[], schedule: ScheduleProtectionLab, index: number) {
    const visits = {
      date: moment(schedule.Date, 'DD.MM.YYYY'), 
      students: students.map(s => ({ 
        name: s.FullName, 
        mark: s.LabVisitingMark[index].Mark, 
        comment: s.LabVisitingMark[index].Comment,
        showForStudent: s.LabVisitingMark[index].ShowForStudent
      }))
    };
    const dialogData: DialogData = {
      title: this.translate.transform('text.subjects.attendance.lesson', 'Посещаемость занятий'),
      buttonText: this.translate.transform('button.save', 'Сохранить'),
      body: visits
    };
    const dialogRef = this.dialogService.openDialog(VisitingPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(result => result),
        map(result => this.getVisitingLabs(students, index, schedule.ScheduleProtectionLabId, result.students)),
      ).subscribe((visiting) => {
        this.store.dispatch(labsActions.setLabsVisitingDate({ visiting }));
      })
    );
  }

  private getVisitingLabs(students: StudentMark[], index: number, dateId: number, visits): { Id: number[], comments: string[], showForStudents: boolean[], dateId: number, marks: string[], students: StudentMark[] } {
    const visitsModel = { Id: [], comments: [], showForStudents: [], dateId, marks: [], studentsId: [], students };

    students.forEach(student => {
      visitsModel.Id.push(student.LabVisitingMark[index].LabVisitingMarkId);
      visitsModel.studentsId.push(student.StudentId);
    });
    visits.forEach(visit => {
      visitsModel.marks.push(visit.mark ? visit.mark.toString() : '');
      visitsModel.comments.push(visit.comment);
      visitsModel.showForStudents.push(visit.showForStudent);
    });
    return visitsModel
  }

  navigateToProfile(student: StudentMark): void {
    this.store.dispatch(catsActions.sendMessage({ message: new Message('Route', `web/profile/${student.StudentId}`) }));
  }
}
