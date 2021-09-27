import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {Lesson} from '../model/lesson.model';
import {LessonService} from '../service/lesson.service';
import {Note} from '../model/note.model';
import {NoteService} from '../service/note.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Message} from '../../../../../container/src/app/core/models/message';
import {CreateLessonComponent} from '../modal/create-lesson/create-lesson.component';
import {ConfirmationComponent} from '../modal/confirmation/confirmation.component';
import {DatePipe} from '@angular/common';
import {ModuleCommunicationService} from 'test-mipe-bntu-schedule';
import {TranslatePipe} from '../../../../../container/src/app/pipe/translate.pipe';
import { HelpPopoverScheduleComponent } from './help-popover/help-popover-schedule.component';


const colors: any = {
  color: {
    primary: 'white',
    secondary: 'black',
  }
};

@Component({
  selector: 'app-schedule-main',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-main.component.html',
  styleUrls: ['./schedule-main.component.css']
})
export class ScheduleMainComponent implements OnInit {

  constructor(private lessonservice: LessonService,
              private noteService: NoteService,
              private dialog: MatDialog,
              private datePipe: DatePipe,
              private translatePipe: TranslatePipe,
              private modulecommunicationservice: ModuleCommunicationService) {
  }

  isLoadActive = true;
  scheduleWidth = '82%';
  newsWidth = '18%';
  newsLeft = '82%';
  hideButton = '';
  locale: string;
  lessons: Lesson[] = [];
  notes: Note[] = [];
  lesson: Lesson = new Lesson();
  view: CalendarView;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  user: any;
  format = 'dd.MM.yyyy';
  localeD = 'en-US';
  teacher = 'Попова Ю.Б.';
  isStudent: boolean;
  diplomCon: any[] = [];
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  message = 'Чтобы добавить лабораторное, практическое занятие или лекцию, нажмите на нужную ячейку. ' +
    'Также Вы можете добавить даты занятий с помощью подразделов Практические занятия, Лабораторные работы, ' +
    'Лекции в определенном предмете.';
  action = 'Понятно';

  public isMobile(): boolean {
    return window.matchMedia('screen and (max-width: 550px)').matches
      || window.matchMedia('screen and (min-width: 550px) and (max-width: 767px)').matches;
  }

  ngOnInit() {
    if (this.isMobile()) {
      this.view = CalendarView.Day;
    } else {
      this.view = CalendarView.Week;
    }
    this.locale = this.translatePipe.transform('text.schedule.locale.en', 'ru');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.changeDate();
    this.isLoadActive = false;


    if (this.user.role === 'student') {
      this.isStudent = false;
    } else {
      this.isStudent = true;
    }

  }

  // tslint:disable-next-line:typedef
  setView(view: CalendarView) {
    this.view = view;
  }

  // tslint:disable-next-line:typedef
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  calculateTitel(lesson: Lesson): any {
    let teacher = '';
    let minS;
    let building = '';
    let memo = '';
    minS = lesson.Start.split(':')[1];
    if (minS.toString().length === 1) {
      minS = '0' + minS;
    }
    let minE;
    minE = lesson.End.split(':')[1];
    if (minE.toString().length === 1) {
      minE = '0' + minE;
    }
    if (lesson.Building != undefined) {
      building = lesson.Building;
    }
    if (lesson.Notes.length != 0) {
      memo = lesson.Notes[0].message;
    } else {
      memo = '';
    }
    if (lesson.Teacher != undefined) {
      teacher = lesson.Teacher.FullName;
    }
    return lesson.Start.split(':')[0] + ':' + minS + '-'
      + lesson.End.split(':')[0] + ':' + minE
      + '|' + lesson.Audience + '|' + building
      + '|' + lesson.ShortName + '|' + lesson.Type
      + '|' + teacher + '|' + lesson.Color
      + '|' + lesson.Name + '|' + lesson.SubjectId + '|' + memo + '|' + lesson.GroupId + '|' + lesson.SubGroupId
      + '|' + lesson.GroupName + '|' + lesson.SubGroupName;
  }

  getTitelConsultation(consultation: any) {
    return consultation.StartTime.split(':')[0] + ':' +  consultation.StartTime.split(':')[1] +  '-'
           + consultation.EndTime.split(':')[0] + ':' +  consultation.EndTime.split(':')[1] +  '|' +
           + consultation.Audience + '|' + consultation.Building + '|' + '|' + 'ДП' + '|' + '|' + 'White' + '|' + '|' + '|'
      + '|' + '|' + '|' + '|';
  }

  getTitelDiplomConsultation(consultation: any) {
    return consultation.Start.split(':')[0] + ':' +  consultation.Start.split(':')[1] +  '-'
      + consultation.End.split(':')[0] + ':' +  consultation.End.split(':')[1] +  '|' +
      + consultation.Audience + '|' + consultation.Building + '|' + '|' + 'ДП' + '|' + '|' + 'White' + '|' + '|' + '|'
      + '|' + '|' + '|' + '|';
  }

  getToolTip(title: string): any {
    let group = this.lessonservice.getTitelPart(title, 12);
    let subGroup = this.lessonservice.getTitelPart(title, 13);
    if (group != 'null') {
      group += ' \n';
    } else {
      group = '';
    }

    if (subGroup != 'null') {
      subGroup += ' \n';
    } else {
      subGroup = '';
    }
    return this.lessonservice.getTitelPart(title, 7) + group + subGroup;
  }

  isNote(event): boolean {
    return event.meta === 'note';
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
  }

  addZerros(segment): any {
    return segment.date.getHours() + ':00';
  }

  public rerouteToSubject(title: string) {
    const message: Message = new Message();
    message.Value = this.lessonservice.getReferenceToSubject(title);
    message.Type = 'Route';
    this.modulecommunicationservice.sendMessage(window.parent, message);
  }


  hourClick(dateEvent: any) {
    const dialogRef = this.dialog.open(CreateLessonComponent,
      {
        width: '600px',
        height: '100%',
        disableClose: true,
        data: {user: this.user, date: dateEvent},
        position: {top: '0%'}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.type === 'lesson') {
          this.lesson = result.lesson;
          const startT = new Date(this.lesson.Date);
          const endT = new Date(this.lesson.Date);
          startT.setHours(+this.lesson.Start.split(':')[0], +this.lesson.Start.split(':')[1]);
          endT.setHours(+this.lesson.End.split(':')[0], +this.lesson.End.split(':')[1]);
          this.lesson = result.lesson;
          this.lessons.push(this.lesson);
          this.events.push({
            id: this.lesson.Id,
            start: startT,
            end: endT,
            title: this.calculateTitel(this.lesson),
            color: colors.color,
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
            draggable: false,
            meta: 'lesson'
          });
        } else if (result.type === 'note') {
          this.notes.push(result.note);
          this.events = [
            ...this.events,
            {
              id: result.note.id,
              start: result.note.start,
              end: result.note.end,
              title: result.note.title + '|' + result.note.note,
              color: colors.color,
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false
              },
              meta: 'note'
            }
          ];
        } else if (result.type === 'diplom' || result.type === 'course') {
          let titleCon = '';
          if (result.type === 'course') {
            titleCon = this.calculateTitel(result.lesson);
          } else {
            titleCon = this.getTitelDiplomConsultation(result.lesson);
          }
          result.lesson.StartTime =  result.lesson.Start;
          result.lesson.EndTime =  result.lesson.End;
          const startT = new Date(result.lesson.Date);
          const endT = new Date(result.lesson.Date);
          startT.setHours(+result.lesson.Start.split(':')[0], +result.lesson.Start.split(':')[1]);
          endT.setHours(+result.lesson.End.split(':')[0], +result.lesson.End.split(':')[1]);
          this.lesson = result.lesson;
          this.lessons.push(result.lesson);
          this.events.push({
            id: result.lesson.Id,
            start: startT,
            end: endT,
            title: titleCon,
            color: colors.color,
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
            draggable: false,
            meta: 'lesson'
          });
        }
        this.refresh.next();
      }
    });
  }


  deleteEvent(eventToDelete: CalendarEvent) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '250px',
      disableClose: true,
      height: '150px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result) {
          if (eventToDelete.meta == 'lesson') {
            const a = this.lessonservice.getType(eventToDelete.title).replaceAll(' ', '');
            console.log(a);
            if (a == 'Лекция' || a == 'Lect.') {
              this.lessonservice.deleteLecture(eventToDelete.id,
                + this.lessonservice.getTitelPart(eventToDelete.title, 8)).subscribe(res => {
                console.log(res);
              });
            }
            if (a == 'Лаб.работа' || a == 'Lab') {
              this.lessonservice.deleteLab(eventToDelete.id,
                + this.lessonservice.getTitelPart(eventToDelete.title, 8)).subscribe(res => {
                console.log(res);
              });
            }
            if (a == 'Практ.зан.' || a == 'WS') {
              this.lessonservice.deletePractical(eventToDelete.id,
                + this.lessonservice.getTitelPart(eventToDelete.title, 8)).subscribe(res => {
                console.log(res);
              });
            }
            if (a == 'ДП' || a == 'GP') {
              this.lessonservice.deleteDiplomConsultation(eventToDelete.id).subscribe(res => {
                console.log(res);
              });
            }
            if (a == 'КП' || a == 'CP') {
              this.lessonservice.deleteCourseConsultation(eventToDelete.id).subscribe(res => {
                console.log(res);
              });
            }
          }
          this.events = this.events.filter(event => event !== eventToDelete);
          this.refresh.next();
        }
      }
    });
  }

  changeNote(eventToChange: CalendarEvent) {
    const dialogRef = this.dialog.open(CreateLessonComponent, {
      width: '600px',  height: '100%',
      data: {note: eventToChange, user: this.user}, position: {top: '0%'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.note != null) {
        this.events = this.events.filter(event => event !== eventToChange);
        this.events.push({
          id: result.note.id,
          start: result.note.start,
          end: result.note.end,
          title: result.note.title + '|' + result.note.note,
          color: colors.color,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
          meta: eventToChange.meta
        });
        this.refresh.next();
      }
    });
  }

  changeLesson(lessonChanged: CalendarEvent) {
    const dialogRef = this.dialog.open(CreateLessonComponent,
      {width: '600px',  height: '100%', data: {user: this.user, lesson: lessonChanged}, position: {top: '0%'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.lesson = result.lesson;
        const startT = new Date(this.lesson.Date);
        const endT = new Date(this.lesson.Date);
        startT.setHours(+this.lesson.Start.split(':')[0], +this.lesson.Start.split(':')[1]);
        endT.setHours(+this.lesson.End.split(':')[0], +this.lesson.End.split(':')[1]);
        this.events = this.events.filter(event => event !== lessonChanged);
        this.lessons.push(this.lesson);
        let titleLesson = this.calculateTitel(this.lesson);
        if (result.type == 'diplom') {
          titleLesson = this.getTitelDiplomConsultation(this.lesson);
        }
        this.events.push({
          id: this.lesson.Id,
          start: startT,
          end: endT,
          title: titleLesson,
          color: colors.color,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          draggable: false,
          meta: lessonChanged.meta
        });
        this.refresh.next();
      }
    });
  }

  public hideNews() {
    if (this.newsWidth === '0%') {
      this.newsWidth = '18%';
      this.newsLeft = '82%';
      this.scheduleWidth = '82%';
      this.hideButton = '';
    } else {
      this.newsLeft = '100%';
      this.hideButton = '<';
      this.scheduleWidth = '100%';
      this.newsWidth = '0%';
    }
  }

  public getTimeNote(event: any): string {
    return this.datePipe.transform(event.start, 'HH:mm') + '-' + this.datePipe.transform(event.end, 'HH:mm');
  }

  public changeDate(): any {
    const a = new Date(this.viewDate);
    let day = this.viewDate.getDay();
    if (day == 0) {
      day = 7;
    }
    a.setDate(a.getDate() + (7 - day));
    const endDate = this.lessonservice.formatDate3(a);
    a.setDate(a.getDate() - 6);
    const startDate = this.lessonservice.formatDate3(a);
    this.events = [];
    this.lessonservice.getConsultations({
      count: 1000, page: 1}).subscribe(result => {
      result.DiplomProjectConsultationDates.forEach(consultation => {
        const startT = new Date(consultation.Day.split('T')[0] + 'T' + consultation.StartTime);
        const endT = new Date(consultation.Day.split('T')[0] + 'T' + consultation.EndTime);
        this.events.push({
          id: consultation.Id,
          start: startT,
          end: endT,
          title: this.getTitelConsultation(consultation),
          color: colors.color,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          draggable: false,
          meta: 'lesson'
        });
      });
    });
    this.lessonservice.getCourseConsultations({
      count: 1000, page: 1}).subscribe(result => {
      result.CourseProjectConsultationDates.forEach(consultation => {
        const startT = new Date(consultation.Day.split('T')[0] + 'T' + consultation.StartTime);
        const endT = new Date(consultation.Day.split('T')[0] + 'T' + consultation.EndTime);
        this.events.push({
          id: consultation.Id,
          start: startT,
          end: endT,
          title: this.getTitelConsultation(consultation),
          color: colors.color,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          draggable: false,
          meta: 'lesson'
        });
      });
    });
    this.lessonservice.getLessonsByDates(startDate, endDate).subscribe(
      l => {
        this.lessons = l.Schedule;
        this.lessons.forEach(lesson => {
          let dateArray: any;
          dateArray = lesson.Date.split('.');
          const startT = new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0] + 'T' + lesson.Start);
          const endT = new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0] + 'T' + lesson.End);
          lesson.Type = this.lessonservice.getLessonTypeById(lesson.Type);
          // console.log(lesson.Teacher + ' ' + this.lessonservice.cutTeacherName(lesson.Teacher));
          if (lesson.Teacher != null) {
            lesson.Teacher.FullName = this.lessonservice.cutTeacherName(lesson.Teacher.FullName);
          }
          this.events.push({
            id: lesson.Id,
            start: startT,
            end: endT,
            title: this.calculateTitel(lesson),
            color: colors.color,
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
            draggable: false,
            meta: 'lesson'
          });
        });
        this.refresh.next();
      }
    );
  }

  showHelp(): void {
    const dialogRef = this.dialog.open(HelpPopoverScheduleComponent,
      {data: {message: this.translatePipe.transform ('text.help.schedule', this.message),
          action: this.translatePipe.transform ('button.understand', this.action)},
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'backdrop-help',
      panelClass: 'help-popover'
    });

    dialogRef.afterClosed().subscribe(result => {
    });

}

}

