import { Store } from '@ngrx/store'
import { combineLatest, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core'
import { Calendar } from '../../../../models/calendar.model'
import {
  GroupsVisiting,
  LecturesMarksVisiting,
} from '../../../../models/visiting-mark/groups-visiting.model'
import { DialogData } from '../../../../models/dialog-data.model'
import { DeletePopoverComponent } from '../../../../shared/delete-popover/delete-popover.component'
import { VisitingPopoverComponent } from '../../../../shared/visiting-popover/visiting-popover.component'
import { IAppState } from 'src/app/store/state/app.state'
import * as lecturesSelectors from '../../../../store/selectors/lectures.selectors'
import * as lecturesActions from '../../../../store/actions/lectures.actions'
import { DialogService } from 'src/app/services/dialog.service'
import { VisitDateLecturesPopoverComponent } from './visit-date-lectures-popover/visit-date-lectures-popover.component'
import { Help } from 'src/app/models/help.model'
import { Message } from 'src/app/models/message.model'
import * as catsActions from '../../../../store/actions/cats.actions'
import * as moment from 'moment'
import * as groupsSelectors from '../../../../store/selectors/groups.selectors'
import * as subjectSelectors from '../../../../store/selectors/subject.selector'
import { TranslatePipe } from 'educats-translate'
import { SubSink } from 'subsink'
import { Lecture } from 'src/app/models/lecture.model'

@Component({
  selector: 'app-visit-lectures',
  templateUrl: './visit-lectures.component.html',
  styleUrls: ['./visit-lectures.component.less'],
})
export class VisitLecturesComponent implements OnInit, OnDestroy {
  state$: Observable<{
    calendar: Calendar[]
    groupsVisiting: GroupsVisiting
    isTeacher: boolean
    lectures: Lecture[]
  }>
  subs = new SubSink()
  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService,
    private translate: TranslatePipe
  ) {}

  ngOnInit() {
    this.store.dispatch(lecturesActions.loadCalendar())
    this.store.dispatch(lecturesActions.loadLectures())
    this.state$ = combineLatest(
      this.store.select(lecturesSelectors.getCalendar),
      this.store.select(lecturesSelectors.getGroupsVisiting),
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(lecturesSelectors.getLectures)
    ).pipe(
      map(([calendar, groupsVisiting, isTeacher, lectures]) => ({
        calendar,
        groupsVisiting,
        isTeacher,
        lectures: lectures ? lectures : [],
      }))
    )
    this.subs.add(
      this.store.select(groupsSelectors.getCurrentGroup).subscribe((group) => {
        if (group) {
          this.store.dispatch(lecturesActions.loadGroupsVisiting())
        }
      })
    )
  }

  getHeaders(
    lectures: Lecture[]
  ): { head: string; text: string; length: number; tooltip?: string }[] {
    const defaultHeaders = [
      { head: 'emptyPosition', text: '', length: 1 },
      { head: 'emptyName', text: '', length: 1 },
    ]
    return defaultHeaders.concat(
      lectures.map((l, index) => ({
        head: l.LecturesId.toString(),
        text: `Л${index + 1}`,
        length: Math.floor(l.Duration / 2),
        tooltip: l.Theme,
      }))
    )
  }

  getDisplayedColumns(calendar: Calendar[]): string[] {
    return ['position', 'name', ...calendar.map((res) => res.Date + res.Id)]
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
    this.store.dispatch(lecturesActions.resetVisiting())
  }

  settingVisitDate() {
    const dialogData: DialogData = {
      title: this.translate.transform('text.schedule.dates', 'Даты занятий'),
      buttonText: this.translate.transform('button.add', 'Добавить'),
    }
    this.dialogService.openDialog(VisitDateLecturesPopoverComponent, dialogData)
  }

  deletePopover() {
    const dialogData: DialogData = {
      title: this.translate.transform(
        'text.schedule.management.dates.deleting',
        'Удаление дат'
      ),
      body: this.translate.transform(
        'text.schedule.dates.and.connected.data',
        'даты и все связанные с ними данные'
      ),
      buttonText: this.translate.transform('button.delete', 'Удалить'),
    }
    const dialogRef = this.dialogService.openDialog(
      DeletePopoverComponent,
      dialogData
    )

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(lecturesActions.deleteAllDate())
      }
    })
  }

  setVisitMarks(
    date: Calendar,
    lecturesMarksVisiting: LecturesMarksVisiting[],
    index: number
  ): void {
    const visits = {
      date: moment(date.Date, 'DD.MM.YYYY'),
      students: lecturesMarksVisiting.map((student) => ({
        name: student.StudentName,
        mark: student.Marks[index].Mark,
        comment: student.Marks[index].Comment,
      })),
    }

    const dialogData: DialogData = {
      title: this.translate.transform(
        'text.subjects.attendance.students',
        'Посещаемость студентов'
      ),
      buttonText: this.translate.transform('button.save', 'Сохранить'),
      body: visits,
    }
    const dialogRef = this.dialogService.openDialog(
      VisitingPopoverComponent,
      dialogData
    )
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          lecturesActions.setLecturesVisitingDate({
            lecturesMarks: this.getModelVisitLabs(
              [
                ...lecturesMarksVisiting.map((x) => ({
                  ...x,
                  Marks: [...x.Marks.map((m) => ({ ...m }))],
                })),
              ],
              index,
              result.students
            ),
          })
        )
      }
    })
  }

  getModelVisitLabs(
    lecturesMarksVisiting: LecturesMarksVisiting[],
    index: number,
    students: { name: string; mark: string; comment: string }[]
  ): LecturesMarksVisiting[] {
    students.forEach((student, i) => {
      lecturesMarksVisiting[i].Marks[index].Mark = student.mark
        ? student.mark
        : ''
      lecturesMarksVisiting[i].Marks[index].Comment = student.comment
        ? student.comment
        : ''
    })
    return lecturesMarksVisiting
  }

  help: Help = {
    message: this.translate.transform(
      'text.help.lectures',
      'Для добавления или удаления дат лекций нажмите на кнопку "Управление расписанием". Нажмите 2 раза на ячейку с нужной датой, чтобы отметить посещаемость и оставить комментарии.'
    ),
    action: this.translate.transform('button.understand', 'Понятно'),
  }

  navigateToProfile(lecturesMarksVisiting: LecturesMarksVisiting): void {
    this.store.dispatch(
      catsActions.sendMessage({
        message: new Message(
          'Route',
          `web/profile/${lecturesMarksVisiting.StudentId}`
        ),
      })
    )
  }

  getExcelFile() {
    this.store.dispatch(lecturesActions.getVisitingExcel())
  }
}
