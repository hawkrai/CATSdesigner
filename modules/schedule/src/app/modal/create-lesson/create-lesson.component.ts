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

  formGroup: any;
  lesson: any = new LessonAdd() ;
  subjects: any[] = [];
  lessonTypes: string[] = ['Лекция', 'Лаб.работа'];

  constructor(public dialogRef: MatDialogRef<CreateLessonComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private lessonservice: LessonService) { }

  ngOnInit(): void {
    this.lessonservice.getAllSubjects(this.data.userName).subscribe(subjects => {
      this.subjects = subjects;
      console.log(subjects);
    });
    this.formGroup = new FormGroup({
      subjectF: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required])
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

  // tslint:disable-next-line:typedef
  add() {
    this.lesson.title = this.subjects.find(subject => subject.Id == this.lesson.subjectId).ShortName +
      ' - ' + this.formGroup.controls.type.value;
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    this.lesson.start = formatDate(this.lesson.start, format, locale);
    this.dialogRef.close(this.lesson);
  }

  // tslint:disable-next-line:typedef
  onCancelClick() {
    this.dialogRef.close(null);
  }

}
