import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {flatpickrFactory} from '../add-note/add-note.component';
import {Lesson} from '../../model/lesson.model';
import {LessonService} from '../../service/lesson.service';
import {LessonAdd} from '../../model/lessonAdd.model';
import {formatDate, Time} from '@angular/common';
import {Note} from '../../model/note.model';

@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.css']
})
export class CreateLessonComponent implements OnInit {

  changedLesson: any = new LessonAdd();
  changedType: string;
  formGroup: any;
  lesson: any = new Lesson() ;
  subjects: any[] = [];
  lessonTypes: string[][] = [['1', 'Лекция'], ['2', 'Лаб.работа'], ['3', 'Практ.работа']];
  dayOfLesson: Date;
  startTimeOfLesson: string;
  endTimeOfLesson: string;

  formGroupNote: any;
  note: Note = new Note();
  dayOfNote: Date;
  startTimeOfNote: string;
  endTimeOfNote: string;
  selectedIndex = 0;
  disableLesson = false;
  disableNote = false;

  constructor(public dialogRef: MatDialogRef<CreateLessonComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private lessonservice: LessonService) { }

  ngOnInit(): void {
    this.lessonservice.getAllSubjects(this.data.userName).subscribe(subjects => {
      this.subjects = subjects;
      if (this.data.lesson != null) {
        this.dayOfLesson = this.data.lesson.start.getDate();
        this.startTimeOfLesson = this.data.lesson.start.getHours() + ':' + this.data.event.start.getMinutes();
        this.endTimeOfLesson = this.data.lesson.end.getHours() + ':' + this.data.event.end.getMinutes();
        this.lesson.color = this.getColor(this.data.lesson.title);
        this.lesson.subjectId = this.getSubject(this.data.lesson.title);
        this.lesson.teacher = this.getTeacher(this.data.lesson.title);
        this.lesson.classroom = this.getClassroom(this.data.lesson.title);
        this.lesson.building = this.getBuilding(this.data.lesson.title);
        this.changedType = this.lessonTypes.find(type => type[1] === this.getType(this.data.lesson.title).trim())[0];
        this.disableNote = true;
      }
    });
    this.formGroup = new FormGroup({
      subjectF: new FormControl('', [Validators.required]),
      dayEvent: new FormControl('', [Validators.required]),
      startEvent: new FormControl('', [Validators.required]),
      endEvent: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      teacher: new FormControl('', [Validators.required]),
      building: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      classroom: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    });

    this.formGroupNote = new FormGroup({
      title: new FormControl('', [Validators.required]),
      dayNote: new FormControl('', [Validators.required]),
      startNote: new FormControl('', [Validators.required]),
      endNote: new FormControl('', [Validators.required]),
    });

    if (this.data.note != null) {
      const format = 'yyyy-MM-dd';
      const locale = 'en-US';
      this.dayOfNote = new Date(formatDate(this.data.note.start, format, locale));
      console.log(this.dayOfNote);
      this.startTimeOfNote = this.data.note.start.getHours() + ':' + this.data.note.start.getMinutes();
      this.endTimeOfNote = this.data.note.end.getHours() + ':' + this.data.note.end.getMinutes();
      this.note.title = this.data.note.title;
      this.selectedIndex = 1;
      this.disableLesson = true;
    }
    flatpickrFactory();
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

  get color(): FormControl {
    return this.formGroup.get('color') as FormControl;
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

  get classroom(): FormControl {
    return this.formGroup.get('classroom') as FormControl;
  }

  // tslint:disable-next-line:typedef
  addLesson() {
    this.lesson.title = this.subjects.find(subject => subject.Id == this.lesson.subjectId).ShortName +
      ' - ' + this.lessonTypes.find(type => type[0] === this.formGroup.controls.type.value)[1];
    this.lesson.start = this.dayOfLesson;
    const day = new Date(this.dayOfLesson);
    this.lesson.end = day;
    this.lesson.start.setHours(+this.startTimeOfLesson.split(':')[0], +this.startTimeOfLesson.split(':')[1]);
    this.lesson.end.setHours(+this.endTimeOfLesson.split(':')[0], +this.endTimeOfLesson.split(':')[1]);
    this.dialogRef.close({lesson: this.lesson, type: 'lesson'});
  }

  addNote() {
    this.note.start = this.dayOfNote;
    const day = new Date(this.dayOfNote);
    this.note.end = day;
    this.note.start.setHours(+this.startTimeOfNote.split(':')[0], +this.startTimeOfNote.split(':')[1]);
    this.note.end.setHours(+this.endTimeOfNote.split(':')[0], +this.endTimeOfNote.split(':')[1]);
    this.dialogRef.close({note: this.note, type: 'note'});
  }

  // tslint:disable-next-line:typedef
  onCancelClick() {
    this.dialogRef.close(null);
  }

  getSubject(title: string): any {
    const splitted = title.split('|', 8);
    return this.subjects.find(subject => subject.Id == splitted[7]).Id;
  }

  getType(title: string): any {
    const splitted = title.split('|', 5);
    return ' ' + splitted[4] + ' ';
  }

  getColor(title: string): any {
    const splitted = title.split('|', 7);
    return splitted[6] ;
  }

  getTeacher(title: string): any {
    const splitted = title.split('|', 6);
    return splitted[5] ;
  }

  getClassroom(title: string): any {
    const splitted = title.split('|', 3);
    return  splitted[1];
  }

  getBuilding(title: string): any {
    const splitted = title.split('|', 3);
    return splitted[2];
  }
}
