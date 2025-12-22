import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru'
import { pairwise, startWith } from 'rxjs/operators'
import { Lesson } from '../../model/lesson.model'
import { Note } from '../../model/note.model'
import { LessonService } from '../../service/lesson.service'
import { NoteService } from '../../service/note.service'
import { TranslatePipe } from 'educats-translate'

export function flatpickrFactory() {
  flatpickr.localize(Russian)
  return flatpickr
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.css'],
})
export class CreateLessonComponent implements OnInit {
  isEditMode = false;
  dialogTitle = '';
  changedType: string
  formGroup: any
  eventToChange: any
  lesson: Lesson = new Lesson()
  subject: any
  subjects: any[] = []
  lessonTypes: string[][]
  lessonTypesFull: string[][]
  dayOfLesson: Date
  startTimeOfLesson: string
  endTimeOfLesson: string
  startHour: string
  startMin: string
  endHour: string
  endMin: string
  memo: string
  date: string
  groups: any[] = []
  typeSubject: any[] = []
  teachers: any[] = []
  currentGroup: any

  formGroupNote: any
  note: Note = new Note()
  dayOfNote: Date
  startTimeOfNote: string
  endTimeOfNote: string
  selectedIndex = 0
  disableLesson = false
  disableNote = false

  user: any
  selectedTeacher: ''
  stageValue = ''
  stageValueSub = ''
  isDiplomAvailable = false
  isStudentUpdateLesson = false

  constructor(
    public dialogRef: MatDialogRef<CreateLessonComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private lessonservice: LessonService,
    private noteService: NoteService,
    private translate: TranslatePipe,
  ) {
    this.eventToChange = data.note ? { ...data.note } : null;
  }

  ngOnInit(): void {
    this.isEditMode = !!this.data.lesson || !!this.data.note

    if (this.isEditMode) {
      this.dialogTitle = 'text.schedule.edit.event.to.schedule'
    } else {
      this.dialogTitle = 'text.schedule.add.event.to.schedule'
    }

    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.lessonTypes = this.lessonservice.getLessonType()

    this.lessonservice.getUserStatus().subscribe((res) => {
      this.isDiplomAvailable = res.HasChosenDiplomProject

      this.isDiplomAvailable = true
      if (this.isDiplomAvailable) {
        this.lessonTypesFull = this.lessonservice.getLessonTypeFull()
      } else {
        this.lessonTypesFull = this.lessonservice
          .getLessonTypeFull()
          .slice(0, 4)
      }
    })
    if (this.data.notes) {
        if (this.user.role === 'lector' && this.data.notes.global && this.data.notes.global.text) {
          this.memo = this.data.notes.global.text !== undefined ? this.data.notes.global.text : ''
              this.note.id = this.data.notes.global.id !== undefined ? this.data.notes.global.id : 0
        }

        if (this.user.role === 'student' && this.data.notes.personal && this.data.notes.personal.text) {
          this.memo = this.data.notes.personal.text !== undefined ? this.data.notes.personal.text : ''
              this.note.id = this.data.notes.personal.id !== undefined ? this.data.notes.personal.id : 0
        }
    }
    if (this.user.role === 'student') {
      this.isStudentUpdateLesson = true
    }
    this.formGroup = new FormGroup({
      subjectF: new FormControl(
        { value: '', disabled: this.isStudentUpdateLesson },
        [Validators.required]
      ),
      dayEvent: new FormControl(
        { value: '', disabled: this.isStudentUpdateLesson },
        [Validators.required]
      ),
      startEvent: new FormControl(
        { value: '', disabled: this.isStudentUpdateLesson },
        [Validators.required, Validators.min(8)]
      ),
      endEvent: new FormControl(
        { value: '', disabled: this.isStudentUpdateLesson },
        [Validators.required, Validators.min(8)]
      ),
      type: new FormControl(
        { value: '', disabled: this.isStudentUpdateLesson },
        [Validators.required]
      ),
      teacher: new FormControl(
        { value: '', disabled: this.isStudentUpdateLesson },
        [Validators.required]
      ),
      building: new FormControl(
        { value: '', disabled: this.isStudentUpdateLesson },
        [Validators.required, Validators.maxLength(3)]
      ),
      audience: new FormControl(
        { value: '', disabled: this.isStudentUpdateLesson },
        [Validators.required, Validators.maxLength(5)]
      ),
      memo: new FormControl(''),
      group: new FormControl({
        value: '',
        disabled: this.isStudentUpdateLesson,
      }),
      subGroup: new FormControl({
        value: '',
        disabled: this.isStudentUpdateLesson,
      }),
    })
    this.formGroup.controls.teacher.disable()
    this.formGroup.controls.group.disable()
    this.formGroup.controls.subGroup.disable()
    this.formGroup.get('memo').setValue(this.memo)
    this.lessonservice
      .getAllSubjects(this.user.userName)
      .subscribe((subjects) => {
        this.subjects = subjects
        if (this.data.lesson != null) {
          this.lesson.Id = this.data.lesson.id
          this.lesson.SubjectId = this.lessonservice.getTitlePart(
            this.data.lesson.title,
            8
          )
          const teacherId = +this.lessonservice.getTitlePart(
            this.data.lesson.title,
            14
          )
          this.lesson.GroupId = +this.lessonservice.getTitlePart(
            this.data.lesson.title,
            10
          )
          this.lesson.SubGroupId = +this.lessonservice.getTitlePart(
            this.data.lesson.title,
            11
          )
          this.formGroup.get('subjectF').setValue(+this.lesson.SubjectId)
          if (teacherId != null) {
            this.lessonservice
              .getJoinedLector(this.lesson.SubjectId, true)
              .subscribe((re) => {
                this.teachers = re
                this.formGroup.controls.teacher.enable()
                if (this.isStudentUpdateLesson) {
                  this.formGroup.controls.teacher.disable()
                }
                if (this.teachers.length > 0) {
                  const currentLector = this.teachers.find(
                    t => t.LectorId === +this.user.id
                  );
                  if (currentLector) {
                    this.formGroup.controls.teacher.setValue(currentLector.LectorId)
                    this.lesson.Teacher = currentLector
                  } else {
                    this.formGroup.controls.teacher.reset()
                  }
                }
                if (
                  this.teachers.length === 0 &&
                  this.isDiplomAvailable &&
                  this.changedType === '4' &&
                  this.user.role === 'lector'
                ) {
                  const fallbackTeacher = {
                    LectorId: +this.user.id,
                    FullName: this.user.userName,
                  };

                  this.teachers = [fallbackTeacher]
                  this.lesson.Teacher = fallbackTeacher
                  this.formGroup.controls.teacher.setValue(fallbackTeacher.LectorId)
                }
              })
          }

          if (!isNaN(this.lesson.GroupId)) {
            this.lessonservice
              .getGroupsBySubjectId(+this.lesson.SubjectId)
              .subscribe((res) => {
                this.formGroup.controls.group.enable()
                this.formGroup.controls.subGroup.enable()
                if (this.isStudentUpdateLesson) {
                  this.formGroup.controls.group.disable()
                  this.formGroup.controls.subGroup.disable()
                }
                this.groups = res.Groups
                this.currentGroup = this.groups.find(
                  (group) => group.GroupId == this.lesson.GroupId
                )
                this.formGroup.get('group').setValue(this.lesson.GroupId)
                this.formGroup.get('subGroup').setValue(this.lesson.SubGroupId)
              })
          }
        }
      })

    if (this.data.lesson != null) {
      this.startHour = this.data.lesson.start.getHours().toString()
      this.startMin = this.data.lesson.start.getMinutes().toString()
      this.endHour = this.data.lesson.end.getHours().toString()
      this.endMin = this.data.lesson.end.getMinutes().toString()
      this.fillTimeParameters()
      this.dayOfLesson = this.data.lesson.start
      this.startTimeOfLesson = this.startHour + ':' + this.startMin
      this.endTimeOfLesson = this.endHour + ':' + this.endMin
      this.memo = this.data.lesson.Notes && this.data.lesson.Notes.length > 0
        ? this.data.lesson.Notes[0].Text
        : '';
      this.lesson.Audience = this.lessonservice.getTitlePart(
        this.data.lesson.title,
        1
      )
      this.lesson.Building = this.lessonservice.getTitlePart(
        this.data.lesson.title,
        2
      )
      const rawType = this.lessonservice.getType(this.data.lesson.title).trim();

      const found = this.lessonTypes.find(type => type[1] === rawType);

      this.disableNote = true
    }
    this.formGroupNote = new FormGroup({
      title: new FormControl('', [Validators.required]),
      dayNote: new FormControl('', [Validators.required, Validators.min(8)]),
      startNote: new FormControl('', [Validators.required, Validators.min(8)]),
      endNote: new FormControl('', [Validators.required]),
      note: new FormControl(''),
    })
    if (this.data.date != null) {
      this.startHour = this.data.date.getHours() + ''
      this.startMin = this.data.date.getMinutes() + ''
      this.endHour = this.data.date.getHours() + 1 + ''
      this.endMin = this.data.date.getMinutes() + ''
      this.fillTimeParameters()
      this.startTimeOfNote = this.startHour + ':' + this.startMin
      this.endTimeOfNote = this.endHour + ':' + this.endMin
      this.startTimeOfLesson = this.startHour + ':' + this.startMin
      this.endTimeOfLesson = this.endHour + ':' + this.endMin
      this.dayOfNote = this.data.date
      this.dayOfLesson = this.data.date
      this.date = this.lessonservice.formatDate4(this.data.date)
    }
    if (this.data.note != null) {
      this.startHour = this.data.note.start.getHours() + ''
      this.startMin = this.data.note.start.getMinutes() + ''
      this.endHour = this.data.note.end.getHours() + ''
      this.endMin = this.data.note.end.getMinutes() + ''
      this.fillTimeParameters()
      this.dayOfNote = this.data.note.start
      this.startTimeOfNote = this.startHour + ':' + this.startMin
      this.endTimeOfNote = this.endHour + ':' + this.endMin
      this.note.title = this.noteService.getTitle(this.data.note.title)
      this.note.note = this.noteService.getNote(this.data.note.title)
      this.selectedIndex = 1
      this.disableLesson = true
    }
    if (this.data.user.role === 'student' && this.data.lesson == null) {
      this.selectedIndex = 1
      this.disableLesson = true
      this.isStudentUpdateLesson = true
    }
    this.formGroup.controls.dayEvent.disable()
    this.formGroupNote.controls.dayNote.disable()
    flatpickrFactory()
  }

  fillTimeParameters() {
    if (this.startHour.length === 1) {
      this.startHour = '0' + this.startHour
    }
    if (this.startMin.length === 1) {
      this.startMin = '0' + this.startMin
    }
    if (this.endHour.length === 1) {
      this.endHour = '0' + this.endHour
    }
    if (this.endMin.length === 1) {
      this.endMin = '0' + this.endMin
    }
  }

  get title(): FormControl {
    return this.formGroupNote.get('title') as FormControl
  }

  get dayNote(): FormControl {
    return this.formGroupNote.get('dayNote') as FormControl
  }

  get startNote(): FormControl {
    return this.formGroupNote.get('startNote') as FormControl
  }

  get endNote(): FormControl {
    return this.formGroupNote.get('endNote') as FormControl
  }

  get subjectF(): FormControl {
    return this.formGroup.get('subjectF') as FormControl
  }

  get type(): FormControl {
    return this.formGroup.get('type') as FormControl
  }

  get dayEvent(): FormControl {
    return this.formGroup.get('dayEvent') as FormControl
  }

  get startEvent(): FormControl {
    return this.formGroup.get('startEvent') as FormControl
  }

  get endEvent(): FormControl {
    return this.formGroup.get('endEvent') as FormControl
  }

  get teacher(): FormControl {
    return this.formGroup.get('teacher') as FormControl
  }

  get building(): FormControl {
    return this.formGroup.get('building') as FormControl
  }

  get audience(): FormControl {
    return this.formGroup.get('audience') as FormControl
  }

  get group(): FormControl {
    return this.formGroup.get('group') as FormControl
  }

  get subGroup(): FormControl {
    return this.formGroup.get('subGroup') as FormControl
  }

  addLesson() {
    this.memo = this.formGroup.get('memo').value

    this.subject = this.subjects.find(
      (subject) => subject.Id == this.lesson.SubjectId
    )

    if (this.subject !== undefined) {
      this.lesson.ShortName = this.subject.ShortName
      this.lesson.Name = this.subject.Name
      this.lesson.Color = this.subject.Color
    }
    this.lesson.Date = this.lessonservice.formatDate1(this.dayOfLesson)
    this.lesson.Type = this.lessonTypes.find(
      (type) => type[0] === this.formGroup.controls.type.value
    )[1]
    if (this.startTimeOfLesson > this.endTimeOfLesson) {
      const temp = this.startTimeOfLesson
      this.startTimeOfLesson = this.endTimeOfLesson
      this.endTimeOfLesson = temp
    }
    this.lesson.Start = this.startTimeOfLesson
    this.lesson.End = this.endTimeOfLesson
    if (this.memo != undefined && !this.isStudentUpdateLesson) {
      this.lesson.Notes = [{ Text: this.memo }]
    } else {
      this.lesson.Notes = []
    }
    this.lesson.GroupId = this.formGroup.controls.group.value
    this.lesson.SubGroupId = this.formGroup.controls.subGroup.value
    if (this.isStudentUpdateLesson) {
        if (this.memo && this.memo.trim() !== '') {
              const personalNote: Note = {
                id: this.note.id,
                start: new Date(this.lesson.Date + 'T' + this.lesson.Start),
                end: new Date(this.lesson.Date + 'T' + this.lesson.End),
                title: '',
                note: this.memo,
              };

              this.noteService
                .savePersonalNote(personalNote, this.lessonservice.formatDate2(this.dayOfLesson),
                 this.startTimeOfLesson, this.endTimeOfLesson, this.note.id)
                .subscribe({
                  next: (res) => {
                    console.log('Личная заметка сохранена', res);
                    this.lesson.personalNote = personalNote;
                    if (this.data.notes && this.data.notes.global) {
                      this.lesson.Notes = [
                        { Text: this.data.notes.global.text, Id: this.data.notes.global.id }
                      ];
                    }
                    this.dialogRef.close({ lesson: this.lesson, type: 'lesson' });
                  },
                  error: (err) => {
                    console.error('Ошибка при сохранении личной заметки', err);
                  },
                });
      }
    } else {
      this.lessonservice
        .getLessonModule(this.lesson.SubjectId)
        .subscribe((types) => {
          this.typeSubject = [false, false, false, false]
          types.forEach((type) => {
            if (type.ModuleId == 2) {
              this.typeSubject[0] = true
            }
            if (type.ModuleId == 3) {
              this.typeSubject[1] = true
            }
            if (type.ModuleId == 13) {
              this.typeSubject[2] = true
            }
            if (type.ModuleId == 4) {
              this.typeSubject[3] = true
            }
          })
          if (
            this.formGroup.controls.type.value === '0' &&
            this.typeSubject[0]
          ) {
            this.lessonservice
              .saveLecture(
                this.lesson,
                this.lessonservice.formatDate2(this.dayOfLesson)
              )
              .subscribe((l) => {
                if (l.Code == '200') {
                  if (this.lesson.Notes.length != 0) {
                    this.lessonservice
                      .saveLessonNote({
                        id: this.note.id,
                        subjectId: l.Schedule.SubjectId,
                        text: this.lesson.Notes[0].Text,
                        lecturesScheduleId: l.Schedule.Id,
                      })
                      .subscribe((res) => {
                        console.log(res)
                      })
                  }
                  this.lesson.Id = l.Schedule.Id
                  if (l.Schedule.Teacher != undefined) {
                    this.lesson.Teacher = {
                      LectorId: l.Schedule.Teacher.LectorId,
                      FullName: this.lessonservice.cutTeacherName(
                        l.Schedule.Teacher.FullName
                      ),
                    }
                  }

                  this.lesson.GroupName = this.groups
                     .slice(0, this.groups.length - 1)
                    .map(g => g.GroupName).join('\n');

                  this.dialogRef.close({
                    lesson: this.lesson,
                    type: 'lesson',
                    code: l.Code,
                    message: this.translate.transform(l.Message, l.Message),
                  })
                } else {
                  this.dialogRef.close({ code: l.Code, message: this.translate.transform(l.Message, l.Message) })
                }
              })
          } else if (
            this.formGroup.controls.type.value === '2' &&
            this.typeSubject[1]
          ) {
            this.lessonservice
              .saveLab(
                this.lesson,
                this.lessonservice.formatDate2(this.dayOfLesson)
              )
              .subscribe((l) => {
                if (l.Code == '200') {
                  if (this.lesson.Notes.length != 0) {
                    this.lessonservice
                      .saveLessonNote({
                        id: this.note.id,
                        subjectId: l.Schedule.SubjectId,
                        text: this.lesson.Notes[0].Text,
                        labsScheduleId: l.Schedule.Id,
                      })
                      .subscribe((res) => {
                        console.log(res)
                      })
                  }
                  this.lesson.Id = l.Schedule.Id
                  this.lesson.GroupName = l.Schedule.GroupName
                  this.lesson.SubGroupName = l.Schedule.SubGroupName
                  if (l.Schedule.Teacher != undefined) {
                    this.lesson.Teacher = {
                      LectorId: l.Schedule.Teacher.LectorId,
                      FullName: this.lessonservice.cutTeacherName(
                        l.Schedule.Teacher.FullName
                      ),
                    }
                  }
                  this.dialogRef.close({
                    lesson: this.lesson,
                    type: 'lesson',
                    code: l.Code,
                    message: this.translate.transform(l.Message, l.Message),
                  })
                } else {
                  this.dialogRef.close({ code: l.Code, message: this.translate.transform(l.Message, l.Message) })
                }
              })
          } else if (
            this.formGroup.controls.type.value === '1' &&
            this.typeSubject[2]
          ) {
            this.lessonservice
              .savePractical(
                this.lesson,
                this.lessonservice.formatDate2(this.dayOfLesson)
              )
              .subscribe((l) => {
                if (l.Code == '200') {
                  if (this.lesson.Notes.length != 0) {
                    this.lessonservice
                      .saveLessonNote({
                        id: this.note.id,
                        subjectId: l.Schedule.SubjectId,
                        text: this.lesson.Notes[0].Text,
                        practicalScheduleId: l.Schedule.Id,
                      })
                      .subscribe((res) => {
                        console.log(res)
                      })
                  }
                  this.lesson.Id = l.Schedule.Id
                  this.lesson.GroupName = l.Schedule.GroupName
                  this.lesson.SubGroupName = l.Schedule.SubGroupName
                  if (l.Schedule.Teacher != undefined) {
                    this.lesson.Teacher = {
                      LectorId: l.Schedule.Teacher.LectorId,
                      FullName: this.lessonservice.cutTeacherName(
                        l.Schedule.Teacher.FullName
                      ),
                    }
                  }
                  this.dialogRef.close({
                    lesson: this.lesson,
                    type: 'lesson',
                    code: l.Code,
                    message: this.translate.transform(l.Message, l.Message),
                  })
                } else {
                  this.dialogRef.close({ code: l.Code, message: this.translate.transform(l.Message, l.Message) })
                }
              })
          } else if (
            this.formGroup.controls.type.value === '3' &&
            this.typeSubject[3]
          ) {
            this.dialogRef.close({ lesson: this.lesson, type: 'course' })
            this.lessonservice
              .addCourseConsultation(
                this.lessonservice.formatDate5(this.dayOfLesson) + 'T00:00:00',
                this.lesson.SubjectId,
                this.lesson.Start + ':00',
                this.lesson.End + ':00',
                this.lesson.Audience,
                this.lesson.Building,
                this.lesson.GroupId,
                this.lesson.Id,
                this.lesson.Teacher.LectorId
              )
              .subscribe((r) => {
                console.log(r)
                this.dialogRef.close({
                  code: r.Code,
                  message: this.translate.transform(r.StatusDescription, r.StatusDescription),
                })
              })
            this.lesson.Teacher.FullName = this.lessonservice.cutTeacherName(
              this.lesson.Teacher.FullName
            )
          } else if (this.formGroup.controls.type.value === '4') {
            this.dialogRef.close({ lesson: this.lesson, type: 'diplom' })
            this.lessonservice
              .addDiplomConsultation(
                this.lessonservice.formatDate5(this.dayOfLesson) + 'T00:00:00',
                this.lesson.Start + ':00',
                this.lesson.End + ':00',
                this.lesson.Audience,
                this.lesson.Building
              )
              .subscribe((r) => {
                console.log(r)
              })
          } else {
            this.dialogRef.close({
              lesson: null,
              code: '500',
              message: this.translate.transform('text.date.add.response.failure.unknown', 'text.date.add.response.failure.unknown'),
            })
          }
        })
    }
  }

  addNote() {
    const noteId = this.eventToChange ? this.eventToChange.id : 0
    this.note.start = this.dayOfNote
    const day = new Date(this.dayOfNote)
    this.note.end = day
    if (this.startTimeOfNote > this.endTimeOfNote) {
      const temp = this.startTimeOfNote
      this.startTimeOfNote = this.endTimeOfNote
      this.endTimeOfNote = temp
    }
    this.note.start.setHours(
      +this.startTimeOfNote.split(':')[0],
      +this.startTimeOfNote.split(':')[1]
    )
    this.note.end.setHours(
      +this.endTimeOfNote.split(':')[0],
      +this.endTimeOfNote.split(':')[1]
    )

    this.noteService
      .savePersonalNote(
        this.note,
        this.lessonservice.formatDate2(this.dayOfNote),
        this.startTimeOfNote,
        this.endTimeOfNote,
        noteId,
      )
      .subscribe((l) => {
        console.log(l)
        this.dialogRef.close({
          note: this.note,
          type: 'note',
          message: this.translate.transform(l.Message, l.Message)
        })
      })
  }

  onCancelClick() {
    this.dialogRef.close(null)
  }

  getTypeTooltipByType(typeId: string | number): string {
    if (typeId === '3') {
      return 'text.schedule.course.project'
    }
    if (typeId === '4') {
      return 'text.schedule.graduation.project'
    }
    return ''
  }

  getTypeTooltip(): string {
    if (!this.formGroup) {
      return '';
    }
    const value = this.formGroup.get('type').value;
    if (value === '3') {
      return 'text.schedule.course.project';
    }
    if (value === '4') {
      return 'text.schedule.graduation.project';
    }
    return '';
  }

  subjectChange(event): void {
    const subjectId = event.value;

    if (event.value == 0) {
      this.changedType = '4'
    }

    this.formGroup
      .get('subjectF')
      .valueChanges.pipe(
        startWith(this.formGroup.get('subjectF').value),
        pairwise()
      )
      .subscribe(([old, value]) => {
        if (old == 0) {
          this.changedType = ''
        }
      })

    this.lessonservice.getGroupsBySubjectId(event.value).subscribe((re) => {
      this.groups = re.Groups
    })

    this.lessonservice.getJoinedLector(event.value).subscribe((re) => {
      this.teachers = re

      const currentLector = re.find(t => t.LectorId === +this.user.id);

      if (currentLector) {
        this.formGroup.controls.teacher.setValue(currentLector.LectorId);
        this.lesson.Teacher = currentLector;
        } else {
          this.formGroup.controls.teacher.reset();
        }

      if (
          this.teachers.length === 0 &&
          this.isDiplomAvailable &&
          this.changedType === '4' &&
          this.user.role === 'lector'
        ) {
          const fallbackTeacher = {
            LectorId: +this.user.id,
            FullName: this.user.userName,
          };

          this.teachers = [fallbackTeacher];
          this.formGroup.controls.teacher.setValue(fallbackTeacher.LectorId);
          this.lesson.Teacher = fallbackTeacher;
        }

      this.formGroup.controls.teacher.enable()
    })

    this.lessonservice.getLessonTypes(subjectId).subscribe((types) => {
      this.lessonTypesFull = types;
    });
  }

  teacherChange(event): void {
    this.lesson.Teacher = this.teachers.find(
      (teacher) => teacher.LectorId === event.value
    )
  }

  groupChange(event): void {
    this.currentGroup = this.groups.find(
      (group) => group.GroupId == +event.value
    )
  }

  typeChange(event): void {
    if (this.changedType == '4') {
      this.formGroup.get('subjectF').setValue('')
    }

    if (event.value == '4') {
      this.formGroup.get('subjectF').setValue(0)
    }
    this.changedType = event.value
    if (event.value == '0' || event.value == '4') {
      this.formGroup.controls.group.disable()
      this.formGroup.controls.subGroup.disable()
      this.stageValue = ''
      this.stageValueSub = ''
      this.formGroup.controls.group.setValidators([])
      this.formGroup.controls.subGroup.setValidators([])
    }
    if (event.value == '1' || event.value == '2') {
      this.formGroup.controls.group.enable()
      this.formGroup.controls.subGroup.enable()
      this.formGroup.controls.group.setValidators([Validators.required])
      this.formGroup.controls.subGroup.setValidators([Validators.required])
    }
    if (event.value == '3') {
      this.stageValueSub = ''
      this.formGroup.controls.group.enable()
      this.formGroup.controls.subGroup.disable()
      this.formGroup.controls.group.setValidators([Validators.required])
      this.formGroup.controls.subGroup.setValidators([])
    }
    this.formGroup.controls.group.updateValueAndValidity()
    this.formGroup.controls.subGroup.updateValueAndValidity()
  }
}
