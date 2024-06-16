import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar'
import { NotifierService } from 'angular-notifier'
import { TranslatePipe } from 'educats-translate'
import { Subject } from 'rxjs'
import { ModuleCommunicationService } from 'test-mipe-bntu-schedule'
import { Message } from '../../../../../container/src/app/core/models/message'
import { ConfirmationComponent } from '../modal/confirmation/confirmation.component'
import { CreateLessonComponent } from '../modal/create-lesson/create-lesson.component'
import { Lesson } from '../model/lesson.model'
import { Note } from '../model/note.model'
import { ScheduleStatisticsComponent } from '../schedule-statistics/schedule-statistics.component'
import { LessonService } from '../service/lesson.service'
import { NoteService } from '../service/note.service'
import { HelpPopoverScheduleComponent } from './help-popover/help-popover-schedule.component'

const colors: any = {
  color: {
    primary: 'white',
    secondary: 'black',
  },
}

@Component({
  selector: 'app-schedule-main',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule-main.component.html',
  styleUrls: ['./schedule-main.component.css'],
})
export class ScheduleMainComponent implements OnInit {
  constructor(
    private lessonservice: LessonService,
    private noteService: NoteService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private translatePipe: TranslatePipe,
    private modulecommunicationservice: ModuleCommunicationService,
    private notifierService: NotifierService
  ) {}

  isLoadActive = false
  scheduleWidth = '82%'
  newsWidth = '18%'
  newsLeft = '82%'
  hideButton = ''
  locale: string
  lessons: Lesson[] = []
  notes: Note[] = []
  lesson: Lesson = new Lesson()
  view: CalendarView
  CalendarView = CalendarView
  viewDate: Date = new Date()
  user: any
  format = 'dd.MM.yyyy'
  localeD = 'en-US'
  teacher = 'Попова Ю.Б.'
  isStudent: boolean
  diplomCon: any[] = []
  refresh: Subject<any> = new Subject()
  events: CalendarEvent[] = []

  activeDayIsOpen = true

  message =
    'Чтобы добавить лекцию, практическое занятие, лабораторную работу, консультацию или другое событие, ' +
    'нажмите на нужную ячейку. Также Вы можете добавить даты занятий с помощью аналогичных ' +
    'модулей через пункт меню Предметы'

  action = 'Понятно'

  public isMobile(): boolean {
    return (
      window.matchMedia('screen and (max-width: 550px)').matches ||
      window.matchMedia('screen and (min-width: 550px) and (max-width: 767px)')
        .matches
    )
  }

  ngOnInit() {
    if (this.isMobile()) {
      this.view = CalendarView.Day
    } else {
      this.view = CalendarView.Week
    }
    this.locale = this.translatePipe.transform('text.schedule.locale.en', 'ru')
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.changeDate()
    if (this.user.role === 'student') {
      this.isStudent = true
    } else {
      this.isStudent = false
    }
  }

  // tslint:disable-next-line:typedef
  setView(view: CalendarView) {
    this.view = view
  }

  // tslint:disable-next-line:typedef
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false
  }

  calculateTitle(lesson: Lesson): any {
    let teacher = ''
    let minS
    let building = ''
    let memo = ''
    minS = lesson.Start.split(':')[1]
    if (minS.toString().length === 1) {
      minS = '0' + minS
    }
    let minE
    minE = lesson.End.split(':')[1]
    if (minE.toString().length === 1) {
      minE = '0' + minE
    }
    if (lesson.Building != undefined) {
      building = lesson.Building
    }
    if (lesson.Notes.length != 0) {
      memo = lesson.Notes[0].message
    } else {
      memo = ''
    }
    if (lesson.Teacher != undefined) {
      teacher = lesson.Teacher.FullName
    }
    return (
      lesson.Start.split(':')[0] +
      ':' +
      minS +
      '-' +
      lesson.End.split(':')[0] +
      ':' +
      minE +
      '|' +
      lesson.Audience +
      '|' +
      building +
      '|' +
      lesson.ShortName +
      '|' +
      lesson.Type +
      '|' +
      teacher +
      '|' +
      lesson.Color +
      '|' +
      lesson.Name +
      '|' +
      lesson.SubjectId +
      '|' +
      memo +
      '|' +
      lesson.GroupId +
      '|' +
      lesson.SubGroupId +
      '|' +
      lesson.GroupName +
      '|' +
      lesson.SubGroupName +
      '|' +
      lesson.Teacher.LectorId
    )
  }

  getTitleCourseConsultation(consultation: any) {
    return (
      consultation.StartTime.split(':')[0] +
      ':' +
      consultation.StartTime.split(':')[1] +
      '-' +
      consultation.EndTime.split(':')[0] +
      ':' +
      consultation.EndTime.split(':')[1] +
      '|' +
      consultation.Audience +
      '|' +
      consultation.Building +
      '|' +
      consultation.Subject.ShortName +
      '|' +
      'КП' +
      '|' +
      consultation.Teacher.FullName + 
      '|' +
      consultation.Subject.Color +
      '|' +
      consultation.Subject.Name +
      '|' +
      consultation.Subject.Id +
      '|' +
      '|' +
      consultation.GroupId +
      '|' +
      '|' +
      '|' +
      '|' +
      consultation.Teacher.LectorId
    )
  }

  getTitelConsultation(consultation: any) {
    return (
      consultation.StartTime.split(':')[0] +
      ':' +
      consultation.StartTime.split(':')[1] +
      '-' +
      consultation.EndTime.split(':')[0] +
      ':' +
      consultation.EndTime.split(':')[1] +
      '|' +
      consultation.Audience +
      '|' +
      consultation.Building +
      '|' +
      '|' +
      'ДП' +
      '|' +
      '|' +
      '363636' +
      '|' +
      '|' +
      '|' +
      '|' +
      '|' +
      '|' +
      '|'
    )
  }

  getTitleDiplomConsultation(consultation: any) {
    return (
      consultation.Start.split(':')[0] +
      ':' +
      consultation.Start.split(':')[1] +
      '-' +
      consultation.End.split(':')[0] +
      ':' +
      consultation.End.split(':')[1] +
      '|' +
      consultation.Audience +
      '|' +
      consultation.Building +
      '|' +
      '|' +
      'ДП' +
      '|' +
      '|' +
      '363636' +
      '|' +
      '|' +
      '|' +
      '|' +
      '|' +
      '|' +
      '|'
    )
  }

  getToolTip(title: string): any {
    let group = this.lessonservice.getTitlePart(title, 12)
    let subGroup = this.lessonservice.getTitlePart(title, 13)
    if (group != 'null') {
      group += ' \n'
    } else {
      group = ''
    }

    if (subGroup != 'null') {
      subGroup += ' \n'
    } else {
      subGroup = ''
    }
    return this.lessonservice.getTitlePart(title, 7) + group + subGroup
  }

  isNote(event): boolean {
    return event.meta === 'note'
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        }
      }
      return iEvent
    })
  }

  addZerros(segment): any {
    return segment.date.getHours() + ':00'
  }

  public rerouteToSubject(title: string) {
    const message: Message = new Message()
    message.Value = this.lessonservice.getReferenceToSubject(title)
    message.Type = 'Route'
    window.parent.postMessage(message, '*')
    // this.modulecommunicationservice.sendMessage(window.parent, message);
  }

  hourClick(dateEvent: any) {
    const dialogRef = this.dialog.open(CreateLessonComponent, {
      width: '600px',
      height: '100%',
      disableClose: true,
      data: { user: this.user, date: dateEvent },
      position: { top: '0%' },
    })
    dialogRef.afterClosed().subscribe((result) => {
      let type: string
      if (result.code == '200') {
        type = 'success'
      } else if (result.code == '500') {
        type = 'error'
      }
      if (type != undefined) {
        this.notifierService.notify(type, result.message)
      }

      if (result != null) {
        if (result.type === 'lesson') {
          this.lesson = result.lesson
          const startT = new Date(this.lesson.Date)
          const endT = new Date(this.lesson.Date)
          startT.setHours(
            +this.lesson.Start.split(':')[0],
            +this.lesson.Start.split(':')[1]
          )
          endT.setHours(
            +this.lesson.End.split(':')[0],
            +this.lesson.End.split(':')[1]
          )
          this.lesson = result.lesson
          this.lessons.push(this.lesson)
          this.events.push({
            id: this.lesson.Id,
            start: startT,
            end: endT,
            title: this.calculateTitle(this.lesson),
            color: colors.color,
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
            draggable: false,
            meta: 'lesson',
          })
        } else if (result.type === 'note') {
          if (result.note.note == undefined) {
            result.note.note = ''
          }
          this.notes.push(result.note)
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
                afterEnd: false,
              },
              meta: 'note',
            },
          ]
        } else if (result.type === 'diplom' || result.type === 'course') {
          let titleCon = ''
          if (result.type === 'course') {
            titleCon = this.calculateTitle(result.lesson)
          } else {
            titleCon = this.getTitleDiplomConsultation(result.lesson)
          }
          result.lesson.StartTime = result.lesson.Start
          result.lesson.EndTime = result.lesson.End
          const startT = new Date(result.lesson.Date)
          const endT = new Date(result.lesson.Date)
          startT.setHours(
            +result.lesson.Start.split(':')[0],
            +result.lesson.Start.split(':')[1]
          )
          endT.setHours(
            +result.lesson.End.split(':')[0],
            +result.lesson.End.split(':')[1]
          )
          this.lesson = result.lesson
          this.lessons.push(result.lesson)
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
            meta: 'lesson',
          })
        }
        this.refresh.next()
      }
    })
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '300px',
      disableClose: true,
      height: '150px',
      data: {},
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result) {
          if (eventToDelete.meta == 'lesson') {
            const a = this.lessonservice
              .getType(eventToDelete.title)
              .replaceAll(' ', '')
            console.log(a)
            if (a == 'Лекция' || a == 'Lect.') {
              this.lessonservice
                .deleteLecture(
                  eventToDelete.id,
                  +this.lessonservice.getTitlePart(eventToDelete.title, 8)
                )
                .subscribe((res) => {
                  console.log(res)
                })
            }
            if (a == 'Лаб.работа' || a == 'Lab') {
              this.lessonservice
                .deleteLab(
                  eventToDelete.id,
                  +this.lessonservice.getTitlePart(eventToDelete.title, 8)
                )
                .subscribe((res) => {
                  console.log(res)
                })
            }
            if (a == 'Практ.зан.' || a == 'WS') {
              this.lessonservice
                .deletePractical(
                  eventToDelete.id,
                  +this.lessonservice.getTitlePart(eventToDelete.title, 8)
                )
                .subscribe((res) => {
                  console.log(res)
                })
            }
            if (a == 'ДП' || a == 'GP') {
              this.lessonservice
                .deleteDiplomConsultation(eventToDelete.id)
                .subscribe((res) => {
                  console.log(res)
                })
            }
            if (a == 'КП' || a == 'CP') {
              this.lessonservice
                .deleteCourseConsultation(eventToDelete.id)
                .subscribe((res) => {
                  console.log(res)
                })
            }
          }
          this.events = this.events.filter((event) => event !== eventToDelete)
          this.refresh.next()
        }
      }
    })
  }

  changeNote(eventToChange: CalendarEvent) {
    const dialogRef = this.dialog.open(CreateLessonComponent, {
      width: '600px',
      height: '100%',
      data: { note: eventToChange, user: this.user },
      position: { top: '0%' },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result.note != null) {
        this.events = this.events.filter((event) => event !== eventToChange)
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
          meta: eventToChange.meta,
        })

        this.refresh.next()
      }
    })
  }

  changeLesson(lessonChanged: CalendarEvent) {
    const dialogRef = this.dialog.open(CreateLessonComponent, {
      width: '600px',
      height: '100%',
      data: { user: this.user, lesson: lessonChanged },
      position: { top: '0%' },
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.lesson = result.lesson
        const startT = new Date(this.lesson.Date)
        const endT = new Date(this.lesson.Date)
        startT.setHours(
          +this.lesson.Start.split(':')[0],
          +this.lesson.Start.split(':')[1]
        )
        endT.setHours(
          +this.lesson.End.split(':')[0],
          +this.lesson.End.split(':')[1]
        )
        this.events = this.events.filter((event) => event !== lessonChanged)
        this.lessons.push(this.lesson)
        let titleLesson = this.calculateTitle(this.lesson)
        if (result.type == 'diplom') {
          titleLesson = this.getTitleDiplomConsultation(this.lesson)
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
          meta: lessonChanged.meta,
        })
        this.refresh.next()
      }
    })
  }

  public hideNews() {
    if (this.newsWidth === '0%') {
      this.newsWidth = '18%'
      this.newsLeft = '82%'
      this.scheduleWidth = '82%'
      this.hideButton = ''
    } else {
      this.newsLeft = '100%'
      this.hideButton = '<'
      this.scheduleWidth = '100%'
      this.newsWidth = '0%'
    }
  }

  public getTimeNote(event: any): string {
    return (
      this.datePipe.transform(event.start, 'HH:mm') +
      '-' +
      this.datePipe.transform(event.end, 'HH:mm')
    )
  }

  public changeDate(): any {
    const a = new Date(this.viewDate)
    let day = this.viewDate.getDay()
    if (day == 0) {
      day = 7
    }
    a.setDate(a.getDate() + (7 - day))
    const endDate = this.lessonservice.formatDate3(a)
    a.setDate(a.getDate() - 6)
    const startDate = this.lessonservice.formatDate3(a)
    this.events = []
    this.lessonservice
      .getConsultations({
        count: 1000,
        page: 1,
      })
      .subscribe((result) => {
        if (result.DiplomProjectConsultationDates != undefined) {
          result.DiplomProjectConsultationDates.forEach((consultation) => {
            const startT = new Date(
              consultation.Day.split('T')[0] + 'T' + consultation.StartTime
            )
            const endT = new Date(
              consultation.Day.split('T')[0] + 'T' + consultation.EndTime
            )
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
              meta: 'lesson',
            })
          })
        }
      })
    this.lessonservice
      .getCourseConsultations({
        count: 1000,
        page: 1,
      })
      .subscribe((result) => {
        if (result.Consultations != undefined) {
          result.Consultations.forEach((consultation) => {
            const startT = new Date(
              consultation.Day.split('.')[2] +
              '-' +
              consultation.Day.split('.')[1] +
              '-' +
              consultation.Day.split('.')[0] +
              'T' +
              consultation.StartTime
            )
            const endT = new Date(
              consultation.Day.split('.')[2] +
              '-' +
              consultation.Day.split('.')[1] +
              '-' +
              consultation.Day.split('.')[0] +
              'T' +
              consultation.EndTime
            )
            if (consultation.Teacher != null) {
              consultation.Teacher.FullName = this.lessonservice.cutTeacherName(
                consultation.Teacher.FullName
              )
            }
            this.events.push({
              id: consultation.Id,
              start: startT,
              end: endT,
              title: this.getTitleCourseConsultation(consultation),
              color: colors.color,
              resizable: {
                beforeStart: false,
                afterEnd: false,
              },
              draggable: false,
              meta: 'lesson',
            })
          })
        }
      })
    this.lessonservice.getLessonsByDates(startDate, endDate).subscribe((l) => {
      this.lessons = l.Schedule
      this.lessons.forEach((lesson) => {
        let dateArray: any
        dateArray = lesson.Date.split('.')
        const startT = new Date(
          dateArray[2] +
            '-' +
            dateArray[1] +
            '-' +
            dateArray[0] +
            'T' +
            lesson.Start
        )
        const endT = new Date(
          dateArray[2] +
            '-' +
            dateArray[1] +
            '-' +
            dateArray[0] +
            'T' +
            lesson.End
        )
        lesson.Type = this.lessonservice.getLessonTypeById(lesson.Type)
        // console.log(lesson.Teacher + ' ' + this.lessonservice.cutTeacherName(lesson.Teacher));
        if (lesson.Teacher != null) {
          lesson.Teacher.FullName = this.lessonservice.cutTeacherName(
            lesson.Teacher.FullName
          )
        }
        this.events.push({
          id: lesson.Id,
          start: startT,
          end: endT,
          title: this.calculateTitle(lesson),
          color: colors.color,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          draggable: false,
          meta: 'lesson',
        })

      })

      this.isLoadActive = false
      this.refresh.next()
    })
    this.noteService.GetPersonalNotesBetweenDates(startDate, endDate).subscribe((l) => {
      if (l.Notes && l.Notes.length > 0) {
        l.Notes.forEach((note) => {
          let dateArray = note.Date.split('.');
          let year = parseInt(dateArray[2]);
          let month = parseInt(dateArray[1])-1
          let day = parseInt(dateArray[0]);
          let startTime = note.StartTime.split(':');
          let startHour = parseInt(startTime[0]);
          let startMinute = parseInt(startTime[1]);
          let endTime = note.EndTime.split(':');
          let endHour = parseInt(endTime[0]);
          let endMinute = parseInt(endTime[1]);

          const startT = new Date(year, month, day, startHour, startMinute);
          const endT = new Date(year, month, day, endHour, endMinute);

          this.events.push({
            id: note.Id,
            start: startT,
            end: endT,
            title:note.Text + '|' + note.Note,
            color: colors.color,
            resizable: {
              beforeStart: false,
              afterEnd: false
            },
            draggable: false,
            meta: 'note'
          });

        });
        this.isLoadActive = false;
        this.refresh.next();
      } else {
        console.error('l.Notes is empty or undefined');
      }
    });
  }

  showHelp(): void {
    const dialogRef = this.dialog.open(HelpPopoverScheduleComponent, {
      data: {
        message: this.translatePipe.transform(
          'text.help.schedule',
          this.message
        ),
        action: this.translatePipe.transform('button.understand', this.action),
      },
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'backdrop-help',
      panelClass: 'help-popover',
    })

    dialogRef.afterClosed().subscribe((result) => {})
  }

  openStatisitcs(): void {
    const a = new Date(this.viewDate)
    let day = this.viewDate.getDay()
    if (day == 0) {
      day = 7
    }
    a.setDate(a.getDate() + (7 - day))
    const endDate = this.lessonservice.formatDate1(a)
    a.setDate(a.getDate() - 6)
    const startDate = this.lessonservice.formatDate1(a)
    const dialogRef = this.dialog.open(ScheduleStatisticsComponent, {
      width: '1000px',
      height: '100%',
      data: { schedule: this.events, start: startDate, end: endDate },
      position: { top: '0%' },
    })
  }
}
