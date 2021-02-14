import { Component, OnInit } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import { Subject } from 'rxjs';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {Lesson} from '../model/lesson.model';
import {LessonService} from '../service/lesson.service';
import {Note} from '../model/note.model';
import {NoteService} from '../service/note.service';
import {MatDialog} from '@angular/material';
import {Message} from '../../../../../container/src/app/core/models/message';
import {CreateLessonComponent} from '../modal/create-lesson/create-lesson.component';
import {ConfirmationComponent} from '../modal/confirmation/confirmation.component';
import {DatePipe} from '@angular/common';
import {ModuleCommunicationService} from 'test-mipe-bntu-schedule';


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

  isLoadActive = true;
  toolTip = 'Скрыть новости';
  scheduleWidth = '82%';
  newsWidth = '18%';
  newsLeft = '82%';
  hideButton = '>';
  locale = 'ru';
  lessons: Lesson[] = [];
  subjects: any[] = [];
  notes: Note[] = [];
  lesson: Lesson = new Lesson();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  user: any;

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(private lessonservice: LessonService,
              private noteService: NoteService,
              private dialog: MatDialog,
              private datePipe: DatePipe,
              private modulecommunicationservice: ModuleCommunicationService) {}

  ngOnInit() {
    // localStorage.setItem('currentUser', JSON.stringify({id: 10031, role: 'lector', userName: 'popova'}));
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.isLoadActive = false;
    this.lessonservice.getAllLessons(this.user.userName).subscribe(les => {
      let i = 0;
      if (les.Labs !== undefined) {
        les.Labs.forEach(lab => {
          lab.title = lab.title.replace('  ', ' ');
          this.lesson = this.createLesson(lab, i);
          this.lessons.push(this.lesson);
          i++;
          if (i === 4) {
            i = 0;
          }
        });
      }
      i = 0;
      if (les.Lect !== undefined) {
        les.Lect.forEach(lect => {
          lect.title = lect.title.replace('  ', ' ');
          this.lesson = this.createLesson(lect, i);
          this.lessons.push(this.lesson);
          i++;
          if (i === 4) {
            i = 0;
          }
        });
      }

      this.lessons.forEach(lesson => {
        const startT = new Date(lesson.date);
        const endT = new Date(lesson.date);
        startT.setHours(+lesson.startTime.split(':')[0], + lesson.startTime.split(':')[1]);
        endT.setHours(+lesson.endTime.split(':')[0], + lesson.endTime.split(':')[1]);
        this.events.push({
          id: lesson.id,
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
      this.lessonservice.getAllSubjects(this.user.userName).subscribe(subjects => {
        this.subjects = subjects;
        this.refresh.next();
      });
    });
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
    let minS;
    let building = '';
    let memo = '';
    minS  =  lesson.startTime.split(':')[1];
    if (minS.toString().length === 1) {
      minS = '0' + minS;
    }
    let minE;
    minE  =  lesson.endTime.split(':')[1];
    if (minE.toString().length === 1) {
      minE = '0' + minE;
    }
    if (lesson.building !== undefined) {
      building = lesson.building;
    }
    if (lesson.memo !== undefined) {
      memo = lesson.memo.message;
    }

    return  lesson.startTime.split(':')[0] + ':' + minS + '-'
      +  lesson.endTime.split(':')[0] + ':' + minE
      + '|' + lesson.audience + '|' + building
      + '|' + lesson.shortname + '|' + lesson.type
      + '|' + lesson.teacher  + '|' + lesson.color
      + '|' + lesson.subjectId + '|' + memo;
  }

  getToolTip(title: string): any {
    const splitted = title.split('|', 8);
    return this.subjects.find(subject => subject.Id == splitted[7]).Name;
  }

  isNote(event): boolean {
    return event.meta === 'note';
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd
                    }: CalendarEventTimesChangedEvent): void {
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
    return  segment.date.getHours() + ':00';
  }

  public rerouteToSubject(title: string) {
    const message: Message = new Message();
    message.Value = this.lessonservice.getReferenceToSubject(title);
    message.Type = 'Route';
    this.modulecommunicationservice.sendMessage(window.parent, message);
  }


  hourClick(dateEvent: any) {
    const dialogRef = this.dialog.open(CreateLessonComponent,
      {width: '500px', disableClose: true, data: {user: this.user, date: dateEvent}, position: {top: '1%'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.type === 'lesson') {
          this.lesson = result.lesson;
          const startT = new Date(this.lesson.date);
          const endT = new Date(this.lesson.date);
          startT.setHours(+this.lesson.startTime.split(':')[0], + this.lesson.startTime.split(':')[1]);
          endT.setHours(+this.lesson.endTime.split(':')[0], + this.lesson.endTime.split(':')[1]);
          this.lesson = this.createLessonAll(result.lesson, 0);
          this.lessons.push(this.lesson);
          this.events.push({
            id: this.lesson.id,
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
              title: result.note.title,
              color: colors.color,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              meta: 'note'
            }
          ];
        }
        this.refresh.next();
      }
    });
  }

  createLesson(les: any, i: number): Lesson {
    const lesson: Lesson = new Lesson();
    const splitted = les.title.split(' ', 3);
    lesson.shortname = splitted[0].trim();
    lesson.type = splitted[2].trim();
    lesson.color = les.color;
    lesson.date = this.lessonservice.formatDate(les.date);
    lesson.startTime = les.startTime;
    lesson.endTime = les.endTime;
    lesson.id = les.id;
    lesson.teacher = 'Попова Ю.Б.';
    lesson.building = '11';
    lesson.audience = '110';
    lesson.subjectId = les.subjectId;
    lesson.memo = les.memo;
    return lesson;
  }

  createLessonAll(les: any, i: number): Lesson {
    const lesson: Lesson = new Lesson();
    const splitted = les.title.split(' ', 3);
    lesson.shortname = splitted[0].trim();
    lesson.type = splitted[2].trim();
    lesson.color = les.color;
    lesson.date = this.lessonservice.formatDate(les.date);
    lesson.startTime = les.startTime;
    lesson.endTime = les.endTime;
    lesson.id = les.id;
    lesson.teacher = les.teacher;
    lesson.building = les.building;
    lesson.audience = les.audience;
    lesson.subjectId = les.subjectId;
    lesson.memo = les.memo;
    return lesson;
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '200px',
      disableClose: true,
      height: '150px',
      data: {}
    }) ;
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result) {
          this.events = this.events.filter(event => event !== eventToDelete);
          this.refresh.next();
        }
      }
    });
  }

  changeNote(eventToChange: CalendarEvent) {
    const dialogRef = this.dialog.open(CreateLessonComponent, {width: '500px',
      data: { note: eventToChange, user: this.user}, position: {top: '3%'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.note != null) {
        this.events = this.events.filter(event => event !== eventToChange);
        this.events.push({
          id: result.note.id,
          start: result.note.start,
          end: result.note.end,
          title: result.note.title,
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
      {width: '500px', data: {user: this.user,  lesson: lessonChanged}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.lesson = this.createLessonAll(result.lesson, 0);
        const startT = new Date(this.lesson.date);
        const endT = new Date(this.lesson.date);
        startT.setHours(+this.lesson.startTime.split(':')[0], + this.lesson.startTime.split(':')[1]);
        endT.setHours(+this.lesson.endTime.split(':')[0], + this.lesson.endTime.split(':')[1]);
        this.events = this.events.filter(event => event !== lessonChanged);
        this.lessons.push(this.lesson);
        this.events.push({
          id: this.lesson.id,
          start: startT,
          end: endT,
          title: this.calculateTitel(this.lesson),
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
    if (this.newsWidth === '0%' ) {
      this.newsWidth = '18%';
      this.newsLeft = '82%';
      this.scheduleWidth = '82%';
      this.hideButton = '>';
      this.toolTip = 'Скрыть новости';
    } else {
      this.toolTip = 'Раскрыть новости';
      this.newsLeft = '100%';
      this.hideButton = '<';
      this.scheduleWidth = '100%';
      this.newsWidth = '0%';
    }
  }

  public getTimeNote(event: any): string {
    return this.datePipe.transform(event.start, 'HH:mm') + '-' + this.datePipe.transform(event.end, 'HH:mm');
  }
}

