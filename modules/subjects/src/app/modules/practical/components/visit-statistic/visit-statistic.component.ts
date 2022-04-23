import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, map, take } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import * as catsActions from '../../../../store/actions/cats.actions';
import { IAppState } from '../../../../store/state/app.state';
import { DialogService } from 'src/app/services/dialog.service';
import { Practical } from 'src/app/models/practical.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import * as practicalsSelectors from '../../../../store/selectors/practicals.selectors';
import * as practicalsActions from '../../../../store/actions/practicals.actions';
import * as subjectSelectors from '../../../../store/selectors/subject.selector';
import * as groupsSelectors from '../../../../store/selectors/groups.selectors';
import { StudentMark } from 'src/app/models/student-mark.model';
import { DialogData } from 'src/app/models/dialog-data.model';
import { VisitingPopoverComponent } from 'src/app/shared/visiting-popover/visiting-popover.component';
import { Message } from 'src/app/models/message.model';
import { TranslatePipe } from 'educats-translate';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-visit-statistic',
  templateUrl: './visit-statistic.component.html',
  styleUrls: ['./visit-statistic.component.less']
})
export class VisitStatisticComponent implements OnInit, OnDestroy {

  private subs = new SubSink();

  state$: Observable<{
    practicals: Practical[],
    schedule: ScheduleProtectionPractical[],
    students: StudentMark[],
    userId: number,
    isTeacher: boolean
  }>;

  constructor(
    private dialogService: DialogService,
    private store: Store<IAppState>,
    private translate: TranslatePipe
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.state$ = combineLatest([
      this.store.select(practicalsSelectors.selectPracticals),
      this.store.select(practicalsSelectors.selectSchedule),
      this.store.select(practicalsSelectors.selectMarks),
      this.store.select(subjectSelectors.getUserId),
      this.store.select(subjectSelectors.isTeacher)
    ]).pipe(
      map(([practicals, schedule, students, userId, isTeacher]) => ({ practicals, schedule, students, userId, isTeacher }))
    );

    this.subs.add(
      this.store.select(groupsSelectors.getCurrentGroup).subscribe(group => {
        if (group) {
          this.store.dispatch(practicalsActions.loadSchedule());
          this.store.dispatch(practicalsActions.loadMarks());
        }
      })
    );
  }

  getDisplayedColumns(schedule: ScheduleProtectionPractical[]): string[] {
    return ['position', 'name'].concat(...schedule.map(s => s.Date + s.ScheduleProtectionPracticalId))
  }


  getHeaders(practicals: Practical[]): { head: string, text: string, length: number, tooltip?: string }[] {
    const defaultHeaders = [{ head: 'emptyPosition', text: '', length: 1 }, { head: 'emptyName', text: '', length: 1 }];
    return defaultHeaders.concat(practicals.map((p, index) => ({ head: p.PracticalId.toString(), text: p.ShortName, length: Math.floor(p.Duration / 2), tooltip: p.Theme })))
  }

  setVisitMarks(students: StudentMark[], schedule: ScheduleProtectionPractical) {
    const visits = {
      date: moment(schedule.Date, 'DD.MM.YYYY'),
      students: students.map(s => {
        const practiacalVisitingMark = s.PracticalVisitingMark.find(x => x.ScheduleProtectionPracticalId === schedule.ScheduleProtectionPracticalId);
        return ({
          name: s.FullName,
          mark: practiacalVisitingMark ? practiacalVisitingMark.Mark : '',
          comment:  practiacalVisitingMark ? practiacalVisitingMark.Comment : '',
          showForStudent:  practiacalVisitingMark ? practiacalVisitingMark.ShowForStudent : false
        })
      })
    };
    const dialogData: DialogData = {
      title: this.translate.transform('text.subjects.attendance.lesson', 'Посещаемость занятий'),
      buttonText: this.translate.transform('button.save', 'Сохранить'),
      body: visits
    };
    const dialogRef = this.dialogService.openDialog(VisitingPopoverComponent, dialogData);

    dialogRef.afterClosed().pipe(
      filter(result => result),
      take(1),
      map(result => this.getVisitingPracticals(students, schedule.ScheduleProtectionPracticalId, result.students)),
    ).subscribe((visiting) => {
      this.store.dispatch(practicalsActions.setPracticalsVisitingDate({ visiting }));
    })
  }

  findVisitingIndex(studentMark: StudentMark, schedule: ScheduleProtectionPractical) {
    return studentMark.PracticalVisitingMark.findIndex(x => x.ScheduleProtectionPracticalId === schedule.ScheduleProtectionPracticalId);
  }

  private getVisitingPracticals(students: StudentMark[], dateId: number, visits): { Id: number[], comments: string[], showForStudents: boolean[], dateId: number, marks: string[], students: StudentMark[] } {
    const visitsModel = { Id: [], comments: [], showForStudents: [], dateId, marks: [], studentsId: [], students };
    console.log(visits)
    students.forEach(student => {
      const visitingMark = student.PracticalVisitingMark.find(x => x.ScheduleProtectionPracticalId === dateId);
      visitsModel.Id.push(visitingMark ? visitingMark.PracticalVisitingMarkId: 0);
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
