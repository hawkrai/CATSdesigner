import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Lesson} from '../../model/lesson.model';
import {LessonService} from '../../service/lesson.service';
import {LessonAdd} from '../../model/lessonAdd.model';
import {formatDate} from '@angular/common';
import {Note} from '../../model/note.model';
import flatpickr from 'flatpickr';
import {Russian} from 'flatpickr/dist/l10n/ru';

export function flatpickrFactory() {
  flatpickr.localize(Russian);
  return flatpickr;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.css']
})
export class CreateLessonComponent implements OnInit {

  changedLesson: any = new LessonAdd();
  changedType: string;
  formGroup: any;
  lesson: any = new Lesson() ;
  subject: any;
  subjects: any[] = [];
  lessonTypes: string[][] = [['1', 'Лекция'], ['2', 'Лабораторная работа'],
    ['3', 'Практическое занятие'], ['4', 'Курсовое проектирование']];
  dayOfLesson: Date;
  startTimeOfLesson: string;
  endTimeOfLesson: string;
  startHour: string;
  startMin: string;
  endHour: string;
  endMin: string;
  memo: string;

  formGroupNote: any;
  note: Note = new Note();
  dayOfNote: Date;
  startTimeOfNote: string;
  endTimeOfNote: string;
  selectedIndex = 0;
  disableLesson = false;
  disableNote = false;
  user: any;

  constructor(public dialogRef: MatDialogRef<CreateLessonComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private lessonservice: LessonService) { }

  ngOnInit(): void {
    const format = 'dd.MM.yyyy';
    const locale = 'en-US';
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.lessonservice.getAllSubjects(this.user.username).subscribe(subjects => {
      this.subjects = subjects;
      if (this.data.lesson != null) {
        this.startHour = this.data.lesson.start.getHours().toString();
        this.startMin = this.data.lesson.start.getMinutes().toString();
        this.endHour = this.data.lesson.end.getHours().toString();
        this.endMin  = this.data.lesson.end.getMinutes().toString();
        this.fillTimeParameters();
        this.dayOfLesson = this.lessonservice.formatDate1(this.data.lesson.start);
        this.startTimeOfLesson = this.startHour + ':' + this.startMin;
        this.endTimeOfLesson = this.endHour + ':' + this.endMin;

        this.lesson.color = this.lessonservice.getColor(this.data.lesson.title);
        this.lesson.subjectId = this.lessonservice.getSubject(this.data.lesson.title, this.subjects);
        this.lesson.teacher = this.lessonservice.getTeacher(this.data.lesson.title);
        this.lesson.audience = this.lessonservice.getAudience(this.data.lesson.title);
        this.lesson.building = this.lessonservice.getBuilding(this.data.lesson.title);
        this.memo = this.lessonservice.getMemo(this.data.lesson.title);
        this.changedType = this.lessonTypes.find(type => type[1] === this.lessonservice.getType(this.data.lesson.title).trim())[0];
        this.disableNote = true;
      }
    });
    this.formGroup = new FormGroup({
      subjectF: new FormControl('', [Validators.required]),
      dayEvent: new FormControl('', [Validators.required]),
      startEvent: new FormControl('', [Validators.required]),
      endEvent: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      teacher: new FormControl('', [Validators.required]),
      building: new FormControl('', [ Validators.maxLength(3)]),
      audience: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      memo: new FormControl('', ),
    });

    this.formGroupNote = new FormGroup({
      title: new FormControl('', [Validators.required]),
      dayNote: new FormControl('', [Validators.required]),
      startNote: new FormControl('', [Validators.required]),
      endNote: new FormControl('', [Validators.required]),
    });
    if (this.data.date != null) {
      this.startHour = this.data.date.getHours() + '';
      this.startMin = this.data.date.getMinutes() + '';
      this.endHour = this.data.date.getHours() + 1 + '';
      this.endMin = this.data.date.getMinutes() + '';
      this.fillTimeParameters();
      this.startTimeOfNote = this.startHour + ':' + this.startMin;
      this.endTimeOfNote = this.endHour + ':' + this.endMin;
      this.startTimeOfLesson = this.startHour + ':' + this.startMin;
      this.endTimeOfLesson = this.endHour + ':' + this.endMin;
      this.dayOfNote = new Date(formatDate(this.data.date, format, locale));
      this.dayOfLesson = new Date(formatDate(this.data.date, format, locale));
    }
    if (this.data.note != null) {
      this.startHour = this.data.note.start.getHours() + '';
      this.startMin = this.data.note.start.getMinutes() + '';
      this.endHour = this.data.note.end.getHours() + '';
      this.endMin = this.data.note.end.getMinutes() + '';
      this.fillTimeParameters();
      this.dayOfNote = new Date(formatDate(this.data.note.start, format, locale));
      this.startTimeOfNote = this.startHour + ':' + this.startMin;
      this.endTimeOfNote = this.endHour + ':' + this.endMin;
      this.note.title = this.data.note.title;
      this.selectedIndex = 1;
      this.disableLesson = true;
    }
    if (this.data.user.role === 'student') {
      this.selectedIndex = 1;
      this.disableLesson = true;
    }
    flatpickrFactory();
  }

  fillTimeParameters() {
    if (this.startHour.length === 1) {
      this.startHour = '0' + this.startHour;
    }
    if (this.startMin.length === 1) {
      this.startMin = '0' + this.startMin;
    }
    if (this.endHour.length === 1) {
      this.endHour = '0' + this.endHour;
    }
    if (this.endMin.length === 1) {
      this.endMin = '0' + this.endMin;
    }
  }

  get title(): FormControl {
    return this.formGroupNote.get('title') as FormControl;
  }

  get dayNote(): FormControl {
    return this.formGroupNote.get('dayNote') as FormControl;
  }

  get startNote(): FormControl {
    return this.formGroupNote.get('startNote') as FormControl;
  }

  get endNote(): FormControl {
    return this.formGroupNote.get('endNote') as FormControl;
  }

  get subjectF(): FormControl {
    return this.formGroup.get('subjectF') as FormControl;
  }

  get type(): FormControl {
    return this.formGroup.get('type') as FormControl;
  }

  get dayEvent(): FormControl {
    return this.formGroup.get('dayEvent') as FormControl;
  }

  get startEvent(): FormControl {
    return this.formGroup.get('startEvent') as FormControl;
  }

  get endEvent(): FormControl {
    return this.formGroup.get('endEvent') as FormControl;
  }

  get teacher(): FormControl {
    return this.formGroup.get('teacher') as FormControl;
  }

  get building(): FormControl {
    return this.formGroup.get('building') as FormControl;
  }

  get audience(): FormControl {
    return this.formGroup.get('audience') as FormControl;
  }

  // tslint:disable-next-line:typedef
  addLesson() {
    this.subject = this.subjects.find(subject => subject.Id == this.lesson.subjectId);
    this.lesson.title = this.subject.ShortName +
      ' - ' + this.lessonTypes.find(type => type[0] === this.formGroup.controls.type.value)[1];
    this.lesson.color = this.subject.Color;
    this.lesson.date = this.dayOfLesson;
    if (this.startTimeOfLesson > this.endTimeOfLesson) {
      const temp = this.startTimeOfLesson;
      this.startTimeOfLesson = this.endTimeOfLesson;
      this.endTimeOfLesson = temp;
    }
    this.lesson.startTime = this.startTimeOfLesson;
    this.lesson.endTime = this.endTimeOfLesson;
    this.lesson.memo = {message: this.memo};

    this.dialogRef.close({lesson: this.lesson, type: 'lesson'});
  }

  addNote() {
    this.note.start = this.dayOfNote;
    const day = new Date(this.dayOfNote);
    this.note.end = day;
    if (this.startTimeOfNote > this.endTimeOfNote) {
      const temp = this.startTimeOfNote;
      this.startTimeOfNote = this.endTimeOfNote;
      this.endTimeOfNote = temp;
    }
    this.note.start.setHours(+this.startTimeOfNote.split(':')[0], + this.startTimeOfNote.split(':')[1]);
    this.note.end.setHours(+this.endTimeOfNote.split(':')[0], + this.endTimeOfNote.split(':')[1]);
    this.dialogRef.close({note: this.note, type: 'note'});
  }

  // tslint:disable-next-line:typedef
  onCancelClick() {
    this.dialogRef.close(null);
  }

}
