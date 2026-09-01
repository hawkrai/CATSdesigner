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
import { OperationResultCode } from '../../../../../container/src/app/core/models/OperationResultCode.const'
import { NotificationType } from '../../../../../container/src/app/core/models/notification-type.const'

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

  subGroupMap: Record<string, string> = {
    first: 'text.schedule.subgroup.one',
    second: 'text.schedule.subgroup.two',
    third: 'text.schedule.subgroup.three',
  }

  action = 'Понятно'

  public isMobile(): boolean {
    return (
      window.matchMedia('screen and (max-width: 550px)').matches ||
      window.matchMedia('screen and (min-width: 550px) and (max-width: 767px)')
        .matches
    )
  }

  private isSameLessonAndNote(lesson: Lesson, note: any): boolean {
    if (!lesson || !note) return false

    if (lesson.Date !== note.Date) return false

    if (lesson.Start !== note.StartTime) return false
    if (lesson.End !== note.EndTime) return false

    return true
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

  setView(view: CalendarView) {
    this.view = view
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false
  }

  calculateTitle(lesson: Lesson): any {
    let teacher = ''
    let teacherId = ''
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
    memo = this.getLessonNoteText(lesson)
    if (lesson.Teacher != undefined) {
        teacher = lesson.Teacher.FullName
        if (lesson.Teacher.LectorId != undefined) {
          teacherId = lesson.Teacher.LectorId
        }
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
      teacherId
    )
  }

  getLessonNoteText(lesson: Lesson): string {
       var global = ''
       var personal = ''

       if (lesson.Notes && lesson.Notes.length > 0 && lesson.Notes[0] && lesson.Notes[0].Text) {
         global = lesson.Notes[0].Text
       }
       if (lesson.personalNote && lesson.personalNote.note) {
         personal = lesson.personalNote.note
       }
       if (global !== '' && personal !== '') {
         return global + '\n\n' + personal
       }
       if (global !== '') {
         return global
       }
       if (personal !== '') {
         return '\n\n' + personal
       }
       return ''
  }

  getTitleCourseConsultation(consultation: any) {
    let memo = ''
    memo = this.getLessonNoteText(consultation)

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
      this.translatePipe.transform('text.schedule.course.project.cut', 'КП') +
      '|' +
      consultation.Teacher.FullName +
      '|' +
      consultation.Subject.Color +
      '|' +
      consultation.Subject.Name +
      '|' +
      consultation.Subject.Id +
      '|' +
      memo +
      '|' +
      consultation.GroupId +
      '|' +
      '|' +
      consultation.GroupName +
      '|' +
      '|' +
      consultation.Teacher.LectorId
    )
  }

  formatLecturerName(fullName: string): string {
  if (!fullName) return ''

  const parts = fullName.trim().split(' ').filter(x => x)

  if (parts.length === 1) {
    return parts[0]
  }

  const lastName = parts[0]
  const initials = parts
    .slice(1)
    .map(p => p.charAt(0).toUpperCase() + '.')
    .join(' ')

  return lastName + ' ' + initials
}

  getTitelConsultation(consultation: any) {

  let memo = ''
  memo = this.getLessonNoteText(consultation)

  let teacher = ''

  if (consultation.Teacher && consultation.Teacher.FullName) {
    teacher = consultation.Teacher.FullName
  } else if (consultation.LecturerFullName) {
    teacher = consultation.LecturerFullName
  }

  teacher = this.formatLecturerName(teacher)

  let subjectName = ''
  let subjectId = ''

  if (consultation.Subject) {
    subjectName = consultation.Subject.Name
    subjectId = consultation.Subject.Id
  }

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
    this.translatePipe.transform('text.schedule.graduation.project.cut', 'ДП') +
    '|' +
    this.translatePipe.transform('text.schedule.graduation.project.cut', 'ДП') +
    '|' +
    teacher +
    '|' +
    '#3F51B5' +
    '|' +
    subjectName +
    '|' +
    subjectId +
    '|' +
    memo +
    '|' +
    consultation.GroupId +
    '|' +
    '|' +
    consultation.GroupName +
    '|' +
    '|' +
    ''
  )
}

  getTitleDiplomConsultation(consultation: any) {
  const memo = this.getLessonNoteText(consultation)

  let teacher = ''
  if (consultation.Teacher && consultation.Teacher.FullName) {
    teacher = consultation.Teacher.FullName
  } else if (consultation.LecturerFullName) {
    teacher = consultation.LecturerFullName
  }
  teacher = this.formatLecturerName(teacher)

  let subjectName = ''
  let subjectId = ''
  if (consultation.Subject) {
    subjectName = consultation.Subject.Name
    subjectId = consultation.Subject.Id
  }

  const groupId = consultation.GroupId != null ? consultation.GroupId : ''
  const groupName = consultation.GroupName != null ? consultation.GroupName : ''

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
    this.translatePipe.transform('text.schedule.graduation.project.cut', 'ДП') +
    '|' +
    this.translatePipe.transform('text.schedule.graduation.project.cut', 'ДП') +
    '|' +
    teacher +
    '|' +
    '#3F51B5' +
    '|' +
    subjectName +
    '|' +
    subjectId +
    '|' +
    memo +
    '|' +
    groupId +
    '|' +
    '|' +
    groupName +
    '|' +
    '|' +
    ''
  )
}

  getToolTip(title: string): string {
    const group = this.lessonservice.getTitlePart(title, 12)
    const subGroupKey = this.lessonservice.getTitlePart(title, 13)
    let message = this.lessonservice.getTitlePart(title, 7)

    if (group && group !== 'null') {
      message += '\n' + group + ' '
    }

    if (subGroupKey && subGroupKey !== 'null') {
      const key = this.subGroupMap[subGroupKey]
      if (key) {
        message += this.translatePipe.transform(key, key) + '\n'
      }
    }

    return message
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
      if (result.code == OperationResultCode.Success) {
        type = NotificationType.Success
      } else if (result.code == OperationResultCode.Error) {
        type = NotificationType.Error
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
            titleCon = this.getTitleCourseConsultation(result.lesson)
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
          if (eventToDelete.meta == 'note') {
                const noteId = Number(eventToDelete.id);
                if (noteId) {
                  this.noteService.deletePersonalNote(noteId).subscribe({
                    next: () => {
                      this.events = this.events.filter(event => event !== eventToDelete);
                      this.refresh.next();
                      console.log(`Заметка ${noteId} успешно удалена`);
                    },
                    error: (err) => {
                      console.error('Ошибка при удалении заметки', err);
                    }
                  });
                }
                return;
              }

          if (eventToDelete.meta == 'lesson') {
            const a = this.lessonservice
              .getType(eventToDelete.title)
              .replaceAll(' ', '')
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
      let type: string;
        if (result.code === OperationResultCode.Success) {
          type = NotificationType.Success;
        } else if (result.code === OperationResultCode.Error) {
          type = NotificationType.Error;
        }

        if (type && result.message) {
          this.notifierService.notify(type, result.message);
        }

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
    const lessonObj = this.lessons.find(l => l.Id === lessonChanged.id);

    let globalNoteText = ''
    let globalNoteId = 0
    let personalNoteText = ''
    let personalNoteId = 0

    if(lessonObj){
      if(lessonObj.Notes && lessonObj.Notes.length > 0){
          globalNoteText = lessonObj.Notes[0].Text
          globalNoteId = lessonObj.Notes[0].Id
      }
      if(lessonObj.personalNote && lessonObj.personalNote.note !== undefined &&
        lessonObj.personalNote.note !== null){
          personalNoteText = lessonObj.personalNote.note
          personalNoteId = lessonObj.personalNote.id
      }
    }

    const dialogRef = this.dialog.open(CreateLessonComponent, {
      width: '600px',
      height: '100%',
      data: {
        user: this.user,
        lesson: lessonChanged,
         notes: {
           global: { text: globalNoteText, id: globalNoteId },
           personal: { text: personalNoteText, id: personalNoteId}
         },
        position: { top: '0%' },
      }
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (!result.lesson) {
          if (result.code) {
            this.notifierService.notify(
              result.code === OperationResultCode.Success ? NotificationType.Success : NotificationType.Error,
              result.message
            )
          }
          return
        }

        this.lesson = result.lesson
        const index = this.lessons.findIndex(l => l.Id === result.lesson.Id)
        if (index > -1) {
          this.lessons[index] = this.lesson
        } else {
          this.lessons.push(result.lesson)
        }

        this.lesson.Teacher = {
          FullName: this.lessonservice.getTitlePart(lessonChanged.title, 5),
        }

        this.lesson.GroupName =
          this.lessonservice.getTitlePart(lessonChanged.title, 12)

        this.lesson.SubGroupName =
          this.lessonservice.getTitlePart(lessonChanged.title, 13)

        let type: string
        if (result.code == OperationResultCode.Success) {
          type = NotificationType.Success
        } else if (result.code == OperationResultCode.Error) {
          type = NotificationType.Error
        }
        if (type != undefined) {
          this.notifierService.notify(type, result.message)
        }
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

        let titleLesson = '';
        if (this.user.role === 'student') {
          titleLesson = this.calculateTitle(this.lesson)
        } else {
          const globalNoteOnlyLesson = { ...this.lesson }
          if (globalNoteOnlyLesson.personalNote) {
            delete globalNoteOnlyLesson.personalNote
          }
            titleLesson = this.calculateTitle(globalNoteOnlyLesson)
          }

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
            if (typeof consultation.Notes === 'string') {
                  consultation.Notes = [{ Text: consultation.Notes }]
            }
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

            const lessonLike: Lesson = {
                      Id: consultation.Id,
                      Date: consultation.Day,
                      Start: consultation.StartTime,
                      End: consultation.EndTime,
                      Type: 'КП',
                      Teacher: consultation.Teacher,
                      Name: consultation.Subject.Name,
                      ShortName: consultation.Subject.ShortName,
                      Building: consultation.Building,
                      Audience: consultation.Audience,
                      Color: consultation.Subject.Color,
                      SubjectId: consultation.Subject.Id,
                      Notes: consultation.Notes,
                      GroupId: consultation.GroupId,
                      SubGroupId: null,
                      GroupName: consultation.GroupName,
                      SubGroupName: null,
                      personalNote: undefined,
            }

            this.lessons.push(lessonLike)

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
            this.refresh.next()
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
             this.lessons.forEach((lesson) => {
               if(lesson.Type === 'Лекция' || lesson.Type === 'Lect.'){
                 this.lessonservice.getGroupsBySubjectId(+lesson.SubjectId).subscribe({
                   next: (res) => {
                     lesson.GroupName = res.Groups
                       .slice(0, res.Groups.length - 1)
                       .map(g => g.GroupName)
                       .join('\n');

                     const event = this.events.find(e => e.id === lesson.Id && e.meta === 'lesson');
                     if (event) {
                       event.title = this.calculateTitle(lesson);
                       this.refresh.next();
                     }
                   },
                   error: (err) => console.error(err)
                 });
               }
             });

      this.noteService
        .GetPersonalNotesBetweenDates(startDate, endDate)
        .subscribe((l) => {
          if (!l.Notes || !l.Notes.length) return;

          l.Notes.forEach((note) => {
            if (!note) return;
            const lesson = this.lessons.find(l =>
              note.LessonId ? l.Id === note.LessonId : this.isSameLessonAndNote(l, note)
            );
            if (lesson && !lesson.Notes) {
              lesson.Notes = [];
            }

            const dateArray = note.Date.split('.');
            const startT = new Date(
              +dateArray[2],
              +dateArray[1] - 1,
              +dateArray[0],
              +note.StartTime.split(':')[0],
              +note.StartTime.split(':')[1]
            );
            const endT = new Date(
              +dateArray[2],
              +dateArray[1] - 1,
              +dateArray[0],
              +note.EndTime.split(':')[0],
              +note.EndTime.split(':')[1]
            );

            if (lesson) {
              lesson.personalNote = {
                id: note.Id,
                start: startT,
                end: endT,
                title: note.Text || '',
                note: note.Note || ''
              };

              const event = this.events.find(e => e.meta === 'lesson' && e.id === lesson.Id);
              if (event) {
                event.title = this.calculateTitle(lesson);
              }

            } else {
              this.events.push({
                id: note.Id,
                start: startT,
                end: endT,
                title: (note.Text || '') + '|' + (note.Note || ''),
                color: colors.color,
                resizable: { beforeStart: false, afterEnd: false },
                draggable: false,
                meta: 'note',
              });
            }
          });

          this.refresh.next();
        });
    })
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