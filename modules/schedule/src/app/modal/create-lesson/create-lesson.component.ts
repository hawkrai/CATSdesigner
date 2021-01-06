import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {flatpickrFactory} from '../add-note/add-note.component';
import {Lesson} from '../../model/lesson.model';
import {LessonService} from '../../service/lesson.service';
import {LessonAdd} from '../../model/lessonAdd.model';
import {formatDate} from '@angular/common';

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

  constructor(public dialogRef: MatDialogRef<CreateLessonComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private lessonservice: LessonService) { }

  ngOnInit(): void {
    this.lessonservice.getAllSubjects(this.data.userName).subscribe(subjects => {
      this.subjects = subjects;
      if (this.data.event != null) {
        const format = 'yyyy-MM-dd HH:mm';
        const locale = 'en-US';
        this.lesson.start = formatDate(this.data.event.start, format, locale);
        this.lesson.end = formatDate(this.data.event.end, format, locale);
        this.lesson.color = this.getColor(this.data.event.title);
        this.lesson.subjectId = this.getSubject(this.data.event.title);
        this.lesson.teacher = this.getTeacher(this.data.event.title);
        this.lesson.classroom = this.getClassroom(this.data.event.title);
        this.lesson.building = this.getBuilding(this.data.event.title);
        this.changedType = this.lessonTypes.find(type => type[1] === this.getType(this.data.event.title).trim())[0];
      }
    });
    this.formGroup = new FormGroup({
      subjectF: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      teacher: new FormControl('', [Validators.required]),
      building: new FormControl('', [Validators.required]),
      classroom: new FormControl('', [Validators.required]),
    });
    flatpickrFactory();
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

  get start(): FormControl {
    return this.formGroup.get('start') as FormControl;
  }

  get end(): FormControl {
    return this.formGroup.get('end') as FormControl;
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
  add() {
    this.lesson.title = this.subjects.find(subject => subject.Id == this.lesson.subjectId).ShortName +
      ' - ' + this.lessonTypes.find(type => type[0] === this.formGroup.controls.type.value)[1];
    const format = 'yyyy-MM-dd HH:mm';
    const locale = 'en-US';
    this.lesson.start = formatDate(this.lesson.start, format, locale);
    this.lesson.end = formatDate(this.lesson.end, format, locale);
    this.dialogRef.close(this.lesson);
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
