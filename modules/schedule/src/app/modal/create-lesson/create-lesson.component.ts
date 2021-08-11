import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Lesson} from '../../model/lesson.model';
import {LessonService} from '../../service/lesson.service';
import {Note} from '../../model/note.model';
import flatpickr from 'flatpickr';
import {Russian} from 'flatpickr/dist/l10n/ru';
import {NoteService} from '../../service/note.service';

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

  changedType: string;
  formGroup: any;
  lesson: Lesson = new Lesson();
  subject: any;
  subjects: any[] = [];
  lessonTypes: string[][];
  lessonTypesFull: string[][];
  dayOfLesson: Date;
  startTimeOfLesson: string;
  endTimeOfLesson: string;
  startHour: string;
  startMin: string;
  endHour: string;
  endMin: string;
  memo: string;
  date: string;
  groups: any[] = [];
  currentGroup: any;

  formGroupNote: any;
  note: Note = new Note();
  dayOfNote: Date;
  startTimeOfNote: string;
  endTimeOfNote: string;
  selectedIndex = 0;
  disableLesson = false;
  disableNote = false;
  disableGroup = true;
  disableSubGroup = true;
  user: any;
  stageValue = '';
  stageValueSub = '';
  isDiplomAvailable = false;

  constructor(public dialogRef: MatDialogRef<CreateLessonComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private lessonservice: LessonService,
              private noteService: NoteService) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.lessonTypes = this.lessonservice.getLessonType();

    this.lessonservice.getUserStatus().subscribe(res => {
      this.isDiplomAvailable = res.HasChosenDiplomProject;

      this.isDiplomAvailable = true;
      if (this.isDiplomAvailable) {
        this.lessonTypesFull = this.lessonservice.getLessonTypeFull();
      } else {
        this.lessonTypesFull = this.lessonservice.getLessonTypeFull().slice(0, 4);
      }
    });
    this.formGroup = new FormGroup({
      subjectF: new FormControl('', [Validators.required]),
      dayEvent: new FormControl('', [Validators.required]),
      startEvent: new FormControl('', [Validators.required, Validators.min(8)]),
      endEvent: new FormControl('', [Validators.required, Validators.min(8)]),
      type: new FormControl('', [Validators.required]),
      teacher: new FormControl('', [Validators.required]),
      building: new FormControl('', [Validators.maxLength(3)]),
      audience: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      memo: new FormControl('', ),
      group: new FormControl('', ),
      subGroup: new FormControl('', )
    });
    this.lessonservice.getAllSubjects(this.user.userName).subscribe(subjects => {
      this.subjects = subjects;
      console.log(subjects);
      this.subjects.sort((a, b) => a.Name.localeCompare(b.Name));
      if (this.data.lesson != null) {
        this.startHour = this.data.lesson.start.getHours().toString();
        this.startMin = this.data.lesson.start.getMinutes().toString();
        this.endHour = this.data.lesson.end.getHours().toString();
        this.endMin = this.data.lesson.end.getMinutes().toString();
        this.fillTimeParameters();
        this.dayOfLesson = this.data.lesson.start;
        this.startTimeOfLesson = this.startHour + ':' + this.startMin;
        this.endTimeOfLesson = this.endHour + ':' + this.endMin;
        this.lesson.Id = this.data.lesson.id;
        this.lesson.SubjectId = this.lessonservice.getTitelPart(this.data.lesson.title, 8);
        this.lesson.Audience = this.lessonservice.getTitelPart(this.data.lesson.title, 1);
        this.lesson.Building = this.lessonservice.getTitelPart(this.data.lesson.title, 2);
        this.lesson.GroupId = +this.lessonservice.getTitelPart(this.data.lesson.title, 10);
        this.lesson.SubGroupId = +this.lessonservice.getTitelPart(this.data.lesson.title, 11);
        this.memo = this.lessonservice.getMemo(this.data.lesson.title);
        if (!isNaN(this.lesson.GroupId)) {
          this.lessonservice.getGroupsBySubjectId(+this.lesson.SubjectId).subscribe(res => {
            this.disableGroup = false;
            this.disableSubGroup = false;
            this.groups = res.Groups;
            this.currentGroup = this.groups.find(group => group.GroupId == this.lesson.GroupId);
            this.formGroup.get('group').setValue(this.lesson.GroupId);
            this.formGroup.get('subGroup').setValue(this.lesson.SubGroupId);
          });
        }
        this.changedType = this.lessonTypes.find(type => type[1] === this.lessonservice.getType(this.data.lesson.title).trim())[0];
        this.disableNote = true;
        this.formGroup.get('subjectF').setValue(+this.lesson.SubjectId);

      }
    });
    this.formGroupNote = new FormGroup({
      title: new FormControl('', [Validators.required]),
      dayNote: new FormControl('', [Validators.required, Validators.min(8)]),
      startNote: new FormControl('', [Validators.required, Validators.min(8)]),
      endNote: new FormControl('', [Validators.required]),
      note: new FormControl('', )
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
      this.dayOfNote = this.data.date;
      this.dayOfLesson = this.data.date;
      this.date = this.lessonservice.formatDate4(this.data.date);
    }
    if (this.data.note != null) {
      this.startHour = this.data.note.start.getHours() + '';
      this.startMin = this.data.note.start.getMinutes() + '';
      this.endHour = this.data.note.end.getHours() + '';
      this.endMin = this.data.note.end.getMinutes() + '';
      this.fillTimeParameters();
      this.dayOfNote = this.data.note.start;
      this.startTimeOfNote = this.startHour + ':' + this.startMin;
      this.endTimeOfNote = this.endHour + ':' + this.endMin;
      this.note.title = this.noteService.getTitle(this.data.note.title);
      this.note.note = this.noteService.getNote(this.data.note.title);
      this.selectedIndex = 1;
      this.disableLesson = true;
    }
    if (this.data.user.role === 'student') {
      this.selectedIndex = 1;
      this.disableLesson = true;
    }
    this.formGroup.controls.teacher.disable();
    this.formGroup.controls.dayEvent.disable();
    this.formGroupNote.controls.dayNote.disable();
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

  get group(): FormControl {
    return this.formGroup.get('group') as FormControl;
  }

  get subGroup(): FormControl {
    return this.formGroup.get('subGroup') as FormControl;
  }

  addLesson() {
    this.subject = this.subjects.find(subject => subject.Id == this.lesson.SubjectId);
    if (this.subject !== undefined) {
      this.lesson.ShortName = this.subject.ShortName;
      this.lesson.Name = this.subject.Name;
      this.lesson.Color = this.subject.Color;
    }
    this.lesson.Date = this.lessonservice.formatDate1(this.dayOfLesson);
    this.lesson.Type = this.lessonTypes.find(type => type[0] === this.formGroup.controls.type.value)[1];
    if (this.startTimeOfLesson > this.endTimeOfLesson) {
      const temp = this.startTimeOfLesson;
      this.startTimeOfLesson = this.endTimeOfLesson;
      this.endTimeOfLesson = temp;
    }
    this.lesson.Start = this.startTimeOfLesson;
    this.lesson.End = this.endTimeOfLesson;
    if (this.memo != undefined) {
      this.lesson.Notes = [{message: this.memo}];
    } else {
      this.lesson.Notes = [];
    }
    this.lesson.GroupId = this.formGroup.controls.group.value;
    this.lesson.SubGroupId = this.formGroup.controls.subGroup.value;
    if (this.formGroup.controls.type.value === '0') {
      this.lessonservice.saveLecture(this.lesson, this.lessonservice.formatDate2(this.dayOfLesson)).subscribe(l => {
        if (l.Code == '200') {
          this.lessonservice.saveLessonNote(l.Schedule.Id, this.lesson.Notes[0].message).subscribe(res => {
            console.log(res);
          });
          this.lesson.Id = l.Schedule.Id;
          if (l.Schedule.Teacher != undefined) {
            this.lesson.Teacher = {FullName: this.lessonservice.cutTeacherName(l.Schedule.Teacher.FullName)};
          }
          this.dialogRef.close({lesson: this.lesson, type: 'lesson'});
        } else {
          this.dialogRef.close();
        }
      });
    } else if (this.formGroup.controls.type.value === '1') {
      this.lessonservice.saveLab(this.lesson,  this.lessonservice.formatDate2(this.dayOfLesson)).subscribe(l => {
        if (l.Code == '200') {
          this.lessonservice.saveLessonNote(l.Schedule.Id, this.lesson.Notes[0].message).subscribe(res => {
            console.log(res);
          });
          this.lesson.Id = l.Schedule.Id;
          if (l.Schedule.Teacher != undefined) {
            this.lesson.Teacher = {FullName: this.lessonservice.cutTeacherName(l.Schedule.Teacher.FullName)};
          }
          this.dialogRef.close({lesson: this.lesson, type: 'lesson'});
        } else {
          this.dialogRef.close();
        }
      });
    } else if (this.formGroup.controls.type.value === '2') {
      this.lessonservice.savePractical(this.lesson,  this.lessonservice.formatDate2(this.dayOfLesson)).subscribe(l => {
        if (l.Code == '200') {
          this.lessonservice.saveLessonNote(l.Schedule.Id, this.lesson.Notes[0].message).subscribe(res => {
            console.log(res);
          });
          this.lesson.Id = l.Schedule.Id;
          if (l.Schedule.Teacher != undefined) {
            this.lesson.Teacher = {FullName: this.lessonservice.cutTeacherName(l.Schedule.Teacher.FullName)};
          }
          this.dialogRef.close({lesson: this.lesson, type: 'lesson'});
        } else {
          this.dialogRef.close();
        }
      });
    } else if (this.formGroup.controls.type.value === '4') {
      this.dialogRef.close({lesson: this.lesson, type: 'diplom'});
      this.lessonservice.addDiplomConsultation(this.lessonservice.formatDate5(this.dayOfLesson) + 'T00:00:00',
        this.lesson.Start + ':00', this.lesson.End + ':00',
        this.lesson.Building, this.lesson.Audience).subscribe( r => {
          console.log(r);
      });
    }
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
    this.note.start.setHours(+this.startTimeOfNote.split(':')[0], +this.startTimeOfNote.split(':')[1]);
    this.note.end.setHours(+this.endTimeOfNote.split(':')[0], +this.endTimeOfNote.split(':')[1]);
    this.noteService.savePersonalNote(this.note, this.lessonservice.formatDate2(this.dayOfNote),
                                      this.startTimeOfNote, this.endTimeOfNote).subscribe(l => {
      console.log(l);
    });
    this.dialogRef.close({note: this.note, type: 'note'});
  }

  // tslint:disable-next-line:typedef
  onCancelClick() {
    this.dialogRef.close(null);
  }

  subjectChange(event): void {
    if (event.value == 0) {
      this.changedType = '4';
    }
    this.lessonservice.getGroupsBySubjectId(event.value).subscribe(re => {
      this.groups = re.Groups;
    });
  }

  groupChange(event): void {
    this.currentGroup = this.groups.find(group => group.GroupId == +event.value);
  }

  typeChange(event): void {
    this.changedType = null;
    if (event.value == '0' || event.value == '4' ) {
      this.disableGroup = true;
      this.disableSubGroup = true;
      this.stageValue = '';
      this.stageValueSub = '';
      this.formGroup.controls.group.setValidators([]);
      this.formGroup.controls.subGroup.setValidators([]);
    }
    if (event.value == '1' || event.value == '2' ) {
      this.disableGroup = false;
      this.disableSubGroup = false;
      this.changedType = '2';
      this.formGroup.controls.group.setValidators([Validators.required]);
      this.formGroup.controls.subGroup.setValidators([Validators.required]);
    }
    if ( event.value == '3' ) {
      this.stageValueSub = '';
      this.disableGroup = false;
      this.disableSubGroup = true;
      this.formGroup.controls.group.setValidators([Validators.required]);
      this.formGroup.controls.subGroup.setValidators([]);
    }
    this.formGroup.controls.group.updateValueAndValidity();
    this.formGroup.controls.subGroup.updateValueAndValidity();
  }

}
