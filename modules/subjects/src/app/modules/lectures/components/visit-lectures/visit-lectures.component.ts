import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import {Calendar} from '../../../../models/calendar.model';
import {GroupsVisiting, LecturesMarksVisiting} from "../../../../models/visiting-mark/groups-visiting.model";
import {DialogData} from '../../../../models/dialog-data.model';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {VisitingPopoverComponent} from '../../../../shared/visiting-popover/visiting-popover.component';
import { IAppState } from 'src/app/store/state/app.state';
import * as lecturesSelectors from '../../../../store/selectors/lectures.selectors';
import * as  lecturesActions from '../../../../store/actions/lectures.actions';
import { DialogService } from 'src/app/services/dialog.service';
import { VisitDateLecturesPopoverComponent } from './visit-date-lectures-popover/visit-date-lectures-popover.component';

@Component({
  selector: 'app-visit-lectures',
  templateUrl: './visit-lectures.component.html',
  styleUrls: ['./visit-lectures.component.less']
})
export class VisitLecturesComponent implements OnInit, OnChanges, OnDestroy {

  @Input() subjectId: number;
  @Input() isTeacher: boolean;
  @Input() groupId: number;

  state$: Observable<{ calendar: Calendar[], groupsVisiting: GroupsVisiting }>;

  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService
    ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      this.store.dispatch(lecturesActions.loadGroupsVisiting());
    }
  }

  ngOnInit() {
    this.store.dispatch(lecturesActions.loadCalendar());
    this.state$ = combineLatest(
      this.store.select(lecturesSelectors.getCalendar),
      this.store.select(lecturesSelectors.getGroupsVisiting)
    ).pipe(
      map(([calendar, groupsVisiting]) => ({ calendar, groupsVisiting }))
      );
  }

  getDisplayedColumns(calendar: Calendar[]): string[] {
    return ['position', 'name', ...calendar.map(res => res.Date + res.Id)];
  }

  ngOnDestroy(): void {
    this.store.dispatch(lecturesActions.resetVisiting());
  }

  settingVisitDate() {
    const dialogData: DialogData = {
      title: 'Даты занятий',
      buttonText: 'Добавить'
    };
    this.dialogService.openDialog(VisitDateLecturesPopoverComponent, dialogData);
  }

  deletePopover() {
    const dialogData: DialogData = {
      title: 'Удаление дат',
      body: 'даты и все связанные с ними данные',
      buttonText: 'Удалить'
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

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
      const dialogRef = this.dialogService.openDialog(VisitingPopoverComponent, dialogData);
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

}
