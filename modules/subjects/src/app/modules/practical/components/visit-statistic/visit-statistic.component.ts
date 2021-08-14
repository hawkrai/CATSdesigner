import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { filter, map, take } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import * as catsActions from '../../../../store/actions/cats.actions';
import {IAppState} from '../../../../store/state/app.state';
import { DialogService } from 'src/app/services/dialog.service';
import { Practical } from 'src/app/models/practical.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import * as practicalsSelectors from '../../../../store/selectors/practicals.selectors';
import * as practicalsActions from '../../../../store/actions/practicals.actions';
import * as subjectSelectors from '../../../../store/selectors/subject.selector';
import { StudentMark } from 'src/app/models/student-mark.model';
import { DialogData } from 'src/app/models/dialog-data.model';
import { VisitingPopoverComponent } from 'src/app/shared/visiting-popover/visiting-popover.component';
import { TranslatePipe } from '../../../../../../../../container/src/app/pipe/translate.pipe';
import { Help } from 'src/app/models/help.model';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-visit-statistic',
  templateUrl: './visit-statistic.component.html',
  styleUrls: ['./visit-statistic.component.less']
})
export class VisitStatisticComponent implements OnInit, OnChanges {

  @Input() isTeacher: boolean;
  @Input() groupId: number;

  state$: Observable<{ 
    practicals: Practical[], 
    schedule: ScheduleProtectionPractical[], 
    students: StudentMark[], 
    userId: number }>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      this.store.dispatch(practicalsActions.loadMarks());
    }
  }

  constructor(
    private dialogService: DialogService,
    private store: Store<IAppState>,
    private translate: TranslatePipe
  ) { }

  ngOnInit() {
    this.store.dispatch(practicalsActions.loadSchedule());
    this.state$ = combineLatest([
      this.store.select(practicalsSelectors.selectPracticals),
      this.store.select(practicalsSelectors.selectSchedule),
      this.store.select(practicalsSelectors.selectMarks),
      this.store.select(subjectSelectors.getUserId)
    ]).pipe(
      map(([practicals, schedule, students, userId]) => ({ practicals, schedule, students, userId }))
    );
  }

  getDisplayedColumns(schedule: ScheduleProtectionPractical[]): string[] {
    return ['position', 'name'].concat(...schedule.map(s => s.Date + s.ScheduleProtectionPracticalId))
  }


  getHeaders(practicals: Practical[]): { head: string, text: string, length: number, tooltip?: string }[] {
    const defaultHeaders = [{ head: 'emptyPosition', text: '', length: 1 }, { head: 'emptyName', text: '', length: 1 }];
    return defaultHeaders.concat(practicals.map((p, index) => ({head: p.PracticalId.toString(), text: p.ShortName, length: Math.floor(p.Duration / 2), tooltip: p.Theme })))
  }

  setVisitMarks(students: StudentMark[], schedule: ScheduleProtectionPractical, index: number) {
    if (this.isTeacher) {
      const visits = {
        date: moment(schedule.Date, 'DD.MM.YYYY'), 
        students: students.map(s => ({ 
          name: s.FullName, 
          mark: s.PracticalVisitingMark[index].Mark, 
          comment: s.PracticalVisitingMark[index].Comment,
          showForStudent: s.PracticalVisitingMark[index].ShowForStudent
        }))
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
        map(result => this.getVisitingPracticals(students, index, schedule.ScheduleProtectionPracticalId, result.students)),
      ).subscribe((visiting) => {
        this.store.dispatch(practicalsActions.setPracticalsVisitingDate({ visiting }));
      })
    }
  }

  private getVisitingPracticals(students: StudentMark[], index: number, dateId: number, visits): { Id: number[], comments: string[], showForStudents: boolean[], dateId: number, marks: string[], students: StudentMark[] } {
    const visitsModel = { Id: [], comments: [], showForStudents: [], dateId, marks: [], studentsId: [], students };

    students.forEach(student => {
      visitsModel.Id.push(student.PracticalVisitingMark[index].PracticalVisitingMarkId);
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
