import { Component, OnInit } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import { Subject } from 'rxjs';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {Lesson} from '../model/lesson.model';
import {LessonService} from '../service/lesson.service';
import {AddNoteComponent} from '../modal/add-note/add-note.component';
import {Note} from '../model/note.model';
import {NoteService} from '../service/note.service';
import {MatDialog} from '@angular/material';
import {NewsService} from '../service/news.service';
import {Overlay} from '@angular/cdk/overlay';


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

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
      }
    }
  ];


  startTimes: string[] = [' 08:00', ' 09:55', ' 11:40', ' 13:15'];
  endTimes: string[] = [' 09:35', ' 11:30', ' 13:15', ' 15:00'];
  locale = 'ru';

  lessons: Lesson[] = [];
  notes: Note[] = [];
  lesson: Lesson = new Lesson();
  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(private lessonservice: LessonService,
              private noteService: NoteService,
              private newsService: NewsService,
              private overlay: Overlay,
              private dialog: MatDialog ) {}

  ngOnInit() {
      localStorage.setItem('currentUser', JSON.stringify({id: 10031, role: 'lector', userName: 'popova'}));
      const user = JSON.parse(localStorage.getItem('currentUser'));
      this.lessonservice.getAllSubjects(user.userName).subscribe(subjects => {

      });
      this.newsService.getAllNews('ypal0898').subscribe(news => {

      });
      this.lessonservice.getAllLessons(user.userName).subscribe(les => {
        let i = 0;
        les.Labs.forEach(lab => {
          const splitted = lab.title.split(' ', 4);
          this.lesson.shortname = splitted[0].trim();
          this.lesson.type = splitted[3].trim();
          this.lesson.color = lab.color;
          this.lesson.start = new Date(lab.start + this.startTimes[i]);
          this.lesson.end = new Date(lab.start + this.endTimes[i]);
          this.lesson.id = lab.id;
          this.lesson.teacher = 'Попова Ю.Б.';
          this.lesson.building = '11';
          this.lesson.classroom = '110';
          this.lesson.subjectId = lab.subjectId;
          this.lessons.push(this.lesson);
          this.lesson = new Lesson();
          i++;
          if ( i === 4) {
            i = 0;
          }
        });
        i = 0;
        les.Lect.forEach(lect => {
          const splitted = lect.title.split(' ', 4);
          this.lesson.shortname = splitted[0].trim();
          this.lesson.type = splitted[3].trim();
          this.lesson.color = lect.color;
          this.lesson.start = new Date(lect.start + this.startTimes[i]);
          this.lesson.end = new Date(lect.start + this.endTimes[i]);
          this.lesson.id = lect.id;
          this.lesson.teacher = 'Попова Ю.Б.';
          this.lesson.building = '11';
          this.lesson.classroom = '110';
          this.lesson.subjectId = lect.subjectId;
          this.lessons.push(this.lesson);
          this.lesson = new Lesson();
          i++;
          if ( i === 4) {
            i = 0;
          }
        });
        this.lessons.forEach(lesson => {
          console.log(lesson);
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
      });
    /*this.noteService.getNotes().subscribe(notes => {
      this.notes = notes;
      notes.forEach(note => {
        this.events.push({
          id: note.id,
          start: note.start,
          end: note.end,
          title: note.title,
          color: colors.color,
          actions: this.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
          meta: 'note'
        });
      });
    });*/
  }

  // tslint:disable-next-line:typedef
  setView(view: CalendarView) {
    this.view = view;
  }

  // tslint:disable-next-line:typedef
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  /*
    getEventsById(id: string): any {
      return this.events.find((event) => {
        return event.id === id;
      });
    }

    getLessonById(id: string): any {
      return this.lessons.find((lesson) => {
        return lesson.id === id;
      });
    }*/

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
      + '|a.' + lesson.classroom + '|к.' + lesson.building
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
    return splitted[1] + ' ' + splitted[2];
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

  getColor(title: string): any {
    const splitted = title.split('|', 7);
    return splitted[6] ;
  }

  getReferenceToSubject(title: string): any {
    const splitted = title.split('|', 8);
    return '/Subject?subjectId=' + splitted[7] ;
  }

  // tslint:disable-next-line:typedef
  addNote() {
    const dialogRef = this.dialog.open(AddNoteComponent, {width: '300px'});
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.notes.push(result);
        this.events = [
          ...this.events,
          {
            id: result.id,
            start: result.start,
            end: result.end,
            title: result.title,
            color: colors.color,
            actions: this.actions,
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
    });
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
}
