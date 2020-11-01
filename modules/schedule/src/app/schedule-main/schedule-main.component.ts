import { Component, OnInit } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import { Subject } from 'rxjs';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {Lesson} from '../model/lesson.model';
import {LessonService} from '../service/lesson.service';
import {AddNoteComponent} from '../modal/add-note/add-note.component';
import {Note} from '../model/note.model';
import {NoteService} from '../service/note.service';
import {MatDialog} from '@angular/material';
import {Overlay} from '@angular/cdk/overlay';
import {Message} from '../../../../../container/src/app/core/models/message';
import {CreateLessonComponent} from '../modal/create-lesson/create-lesson.component';
import {ConfirmationComponent} from '../modal/confirmation/confirmation.component';
import {DatePipe} from '@angular/common';
import {SelectEventTypeComponent} from '../modal/select-event-type/select-event-type.component';


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
  startTimes: string[] = [' 08:00', ' 09:55', ' 11:40', ' 13:15'];
  endTimes: string[] = [' 09:35', ' 11:30', ' 13:15', ' 15:00'];
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
              private overlay: Overlay,
              private dialog: MatDialog,
              private datePipe: DatePipe) {}

  ngOnInit() {
    localStorage.setItem('currentUser', JSON.stringify({id: 10031, role: 'lector', userName: 'popova'}));
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.isLoadActive = false;
    console.log(this.isLoadActive);
    this.lessonservice.getAllLessons(this.user.userName).subscribe(les => {
      let i = 0;
      les.Labs.forEach(lab => {
        lab.title = lab.title.replace('  ', ' ');
        this.lesson = this.createLesson(lab, i);
        this.lessons.push(this.lesson);
        i++;
        if ( i === 4) {
          i = 0;
        }
      });
      i = 0;
      les.Lect.forEach(lect => {
        lect.title = lect.title.replace('  ', ' ');
        this.lesson = this.createLesson(lect, i);
        this.lessons.push(this.lesson);
        i++;
        if ( i === 4) {
          i = 0;
        }
      });
      this.lessons.forEach(lesson => {
        this.events.push({
          id: lesson.id,
          start: lesson.start,
          end: lesson.end,
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
    minS  =  lesson.start.getMinutes();
    if (minS.toString().length === 1) {
      minS = '0' + minS;
    }
    let minE;
    minE  =  lesson.end.getMinutes();
    if (minE.toString().length === 1) {
      minE = '0' + minE;
    }
    return  lesson.start.getHours() + ':' + minS + '-'
      +  lesson.end.getHours() + ':' + minE
      + '|' + lesson.classroom + '|' + lesson.building
      + '|' + lesson.shortname + '|' + lesson.type
      + '|' + lesson.teacher  + '|' + lesson.color
      + '|' + lesson.subjectId;
  }

  getTime(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[0];
  }

  getLocation(title: string): any {
    const splitted = title.split('|', 3);
    return 'а.' + splitted[1] + ' к.' + splitted[2];
  }

  getName(title: string): any {
    const splitted = title.split('|', 5);
    return splitted[3];
  }

  getType(title: string): any {
    const splitted = title.split('|', 5);
    return ' ' + splitted[4] + ' ';
  }

  getThirdString(title: string): any {
    const splitted = title.split('|', 6);
    return splitted[5] ;
  }

  getColor(event: any): any {
    if (this.isLesson(event)) {
      const splitted = event.title.split('|', 7);
      return splitted[6] ;
    } else {
      return 'white';
    }
  }

  getReferenceToSubject(title: string): any {
    const splitted = title.split('|', 8);
    return '/Subject?subjectId=' + splitted[7] ;
  }

  isLesson(event): boolean {
    return event.meta === 'lesson';
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
    message.Value = this.getReferenceToSubject(title);
    message.Type = 'Route';
    this.sendMessage(message);
  }

  public sendMessage(message: Message): void {
    window.parent.postMessage([{channel: message.Type, value: message.Value}], '*');
  }

  getToolTip(title: string): any {
    const splitted = title.split('|', 8);
    return this.subjects.find(subject => subject.Id == splitted[7]).Name;
  }

  hourClick() {
    const dialogRef = this.dialog.open(SelectEventTypeComponent, {width: '300px', data: {userName: this.user.userName}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.type === 'lesson') {
          console.log(result.lesson);
          this.lesson = this.createLessonAll(result.lesson, 0);
          this.lessons.push(this.lesson);
          this.events.push({
            id: this.lesson.id,
            start: this.lesson.start,
            end: this.lesson.end,
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
    lesson.start = new Date(les.start + this.startTimes[i]);
    lesson.end = new Date(les.start + this.endTimes[i]);
    lesson.id = les.id;
    lesson.teacher = 'Попова Ю.Б.';
    lesson.building = '11';
    lesson.classroom = '110';
    lesson.subjectId = les.subjectId;
    return lesson;
  }

  createLessonAll(les: any, i: number): Lesson {
    const lesson: Lesson = new Lesson();
    const splitted = les.title.split(' ', 3);
    lesson.shortname = splitted[0].trim();
    lesson.type = splitted[2].trim();
    lesson.color = les.color;
    lesson.start = new Date(les.start);
    lesson.end = new Date(les.end);
    lesson.id = les.id;
    lesson.teacher = les.teacher;
    lesson.building = les.building;
    lesson.classroom = les.classroom;
    lesson.subjectId = les.subjectId;
    return lesson;
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '200px',
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

  changeNote(eventToDelete: CalendarEvent) {
    const dialogRef = this.dialog.open(AddNoteComponent, {width: '300px', data: { event: eventToDelete}, position: {top: '11%'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.events = this.events.filter(event => event !== eventToDelete);
        this.events.push({
          id: result.id,
          start: result.start,
          end: result.end,
          title: result.title,
          color: colors.color,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
          meta: eventToDelete.meta
        });
        this.refresh.next();
      }
    });
  }

  changeEvent(eventToDelete: CalendarEvent) {
    const dialogRef = this.dialog.open(CreateLessonComponent,
      {width: '300px', data: {userName: this.user.userName,  event: eventToDelete}});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.events = this.events.filter(event => event !== eventToDelete);
        this.lesson = this.createLessonAll(result, 0);
        this.lessons.push(this.lesson);
        this.events.push({
          id: this.lesson.id,
          start: this.lesson.start,
          end: this.lesson.end,
          title: this.calculateTitel(this.lesson),
          color: colors.color,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          draggable: false,
          meta: eventToDelete.meta
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

