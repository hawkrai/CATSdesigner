import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { filter, map, switchMap } from 'rxjs/operators';
import {Store } from '@ngrx/store';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { StudentMark } from './../../../../models/student-mark.model';
import { Lab, ScheduleProtectionLabs } from '../../../../models/lab.model';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {VisitingPopoverComponent} from '../../../../shared/visiting-popover/visiting-popover.component';
import { DialogService } from 'src/app/services/dialog.service';

import { LabsRestService } from './../../../../services/labs/labs-rest.service';
import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import * as subjectSelectors from '../../../../store/selectors/subject.selector';


@Component({
  selector: 'app-visit-statistics',
  templateUrl: './visit-statistics.component.html',
  styleUrls: ['./visit-statistics.component.less']
})
export class VisitStatisticsComponent implements OnInit, OnChanges,  OnDestroy {

  @Input() isTeacher: boolean;
  @Input() groupId: number;
  private subs = new SubSink();
  
  state$: Observable<{ labs: Lab[], scheduleProtectionLabs: ScheduleProtectionLabs[], students: StudentMark[] }>;

  constructor(
    private store: Store<IAppState>,
    private labsService: LabsRestService,
    public dialogService: DialogService) {
  }

  ngOnDestroy(): void {
     this.subs.unsubscribe();
     this.store.dispatch(labsActions.resetLabs());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      this.store.dispatch(labsActions.loadLabsSchedule());
      this.store.dispatch(labsActions.loadLabStudents());
    }
  }

  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(labsSelectors.getLabs),
      this.store.select(labsSelectors.getLabsCalendar),
      this.store.select(labsSelectors.getLabStudents)
    ).pipe(
      map(([labs, scheduleProtectionLabs, students]) => ({ labs, scheduleProtectionLabs, students }))
    );
  }


  getSubGroupDisplayColumns(schedule: ScheduleProtectionLabs[]) {
    const defaultColumns = ['position', 'name'];
    return [...defaultColumns,  ...schedule.map(res => res.Date + res.ScheduleProtectionLabId)];
  }


  getSubGroupHeaders(subGroupLabs: Lab[]): { head: string, text: string, length: number, tooltip?: string }[] {
    const defaultHeaders = [{ head: 'emptyPosition', text: '', length: 1 }, { head: 'emptyName', text: '', length: 1 }];
    return defaultHeaders.concat(subGroupLabs.map(l => ({head: l.LabId.toString(), text: l.ShortName, length: Math.floor(l.Duration / 2), tooltip: l.Theme })))
  }

  setVisitMarks(students: StudentMark[], schedule: ScheduleProtectionLabs, index: number) {
    console.log(schedule.ScheduleProtectionLabId);
    if (this.isTeacher) {
      const visits = {
        date: schedule.Date, 
        students: students.map(s => ({ 
          name: s.FullName, 
          mark: s.LabVisitingMark[index].Mark, 
          comment: s.LabVisitingMark[index].Comment 
        }))
      };
      const dialogData: DialogData = {
        title: 'Посещаемость занятий',
        buttonText: 'Сохранить',
        body: visits
      };
      const dialogRef = this.dialogService.openDialog(VisitingPopoverComponent, dialogData);

      this.subs.add(
        dialogRef.afterClosed().pipe(
          filter(result => result),
          map(result => this.getVisitingLabs(students, index, schedule.ScheduleProtectionLabId, result.students)),
          switchMap(visiting => this.labsService.setLabsVisitingDate(visiting))
        ).subscribe(() => {
          this.store.dispatch(labsActions.loadLabStudents());
        })
      );
    }
  }

  private getVisitingLabs(students: StudentMark[], index: number, dateId: number, visits): { Id: number[], comments: string[], dateId: number, marks: string[], students: StudentMark[] } {
    const visitsModel = { Id: [], comments: [], dateId, marks: [], studentsId: [], students };

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
}
