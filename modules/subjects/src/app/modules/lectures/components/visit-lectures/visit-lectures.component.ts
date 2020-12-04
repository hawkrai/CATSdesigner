import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {ComponentType} from '@angular/cdk/typings/portal';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import { LecturesRestService } from './../../../../services/lectures/lectures-rest.service';
import {Calendar} from '../../../../models/calendar.model';
import {GroupsVisiting, LecturesMarksVisiting} from "../../../../models/visiting-mark/groups-visiting.model";
import {DialogData} from '../../../../models/dialog-data.model';
import {VisitDatePopoverComponent} from '../../../../shared/visit-date-popover/visit-date-popover.component';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {VisitingPopoverComponent} from '../../../../shared/visiting-popover/visiting-popover.component';
import { IAppState } from 'src/app/store/state/app.state';
import * as lecturesSelectors from '../../../../store/selectors/lectures.selectors';
import * as groupSelectors from '../../../../store/selectors/groups.selectors';
import * as  lecturesActions from '../../../../store/actions/lectures.actions';

@Component({
  selector: 'app-visit-lectures',
  templateUrl: './visit-lectures.component.html',
  styleUrls: ['./visit-lectures.component.less']
})
export class VisitLecturesComponent implements OnInit {

  @Input() 
  subjectId: number;
  @Input() isTeacher: boolean;

  state$: Observable<{ calendar: Calendar[], groupsVisiting: GroupsVisiting }>;
  public displayedColumns: string[] = [];

  constructor(
    private store: Store<IAppState>,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.dispatch(lecturesActions.loadCalendar());
    this.store.dispatch(lecturesActions.loadGroupsVisiting());
    this.state$ = combineLatest(
      this.store.select(lecturesSelectors.getCalendar),
      this.store.select(lecturesSelectors.getGroupsVisiting)
    ).pipe(
      map(([calendar, groupsVisiting]) => ({ calendar, groupsVisiting })),
      tap(({ calendar}) => {
        this.displayedColumns = ['position', 'name', ...calendar.map(res => res.Date + res.Id)];
      })
      );
  }

  settingVisitDate() {
    // const dialogData: DialogData = {
    //   title: 'Даты занятий',
    //   buttonText: 'Добавить',
    //   body: {service: this.lecturesService, restBody: {subjectId: this.subjectId}},
    // };

    // this.openDialog(dialogData, VisitDatePopoverComponent);
  }

  deletePopover() {
    const dialogData: DialogData = {
      title: 'Удаление дат',
      body: 'даты и все связанные с ними данные',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(lecturesActions.deleteAllDate());
      }
    });
  }

  setVisitMarks(date: Calendar, lecturesMarksVisiting: LecturesMarksVisiting[], index: number): void {
    if (this.isTeacher) {
      const visits = {
        date: date.Date,
        students: lecturesMarksVisiting.map(student => ({
          name: student.StudentName,
          mark: student.Marks[index].Mark,
          comment: student.Marks[index].Comment
        }))
      };

      const dialogData: DialogData = {
        title: 'Посещаемость студентов',
        buttonText: 'Сохранить',
        body: visits
      };
      const dialogRef = this.openDialog(dialogData, VisitingPopoverComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(lecturesActions.setLecturesVisitingDate({ lecturesMarks: this.getModelVisitLabs(lecturesMarksVisiting, index, result.students) }));
        }
      });
    }
  }

  getModelVisitLabs(lecturesMarksVisiting: LecturesMarksVisiting[], index: number, students: { name: string, mark: string, comment: string}[]): LecturesMarksVisiting[] {
    students.forEach((student, i) => {
      lecturesMarksVisiting[i].Marks[index].Mark = student.mark ? student.mark : '';
      lecturesMarksVisiting[i].Marks[index].Comment = student.comment ? student.comment : '';
    });
    return lecturesMarksVisiting;
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  getExcelFile() {
    this.store.dispatch(lecturesActions.downloadExcel());
  }

}
