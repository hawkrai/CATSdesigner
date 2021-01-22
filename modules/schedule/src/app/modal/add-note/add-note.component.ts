import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru';
import {Note} from '../../model/note.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {formatDate, Time} from '@angular/common';

export function flatpickrFactory() {
  flatpickr.localize(Russian);
  return flatpickr;
}


@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent implements OnInit {

  formGroup: any;
  note: Note = new Note();
  dayOfNote: Date;
  startTime: Time;
  endTime: Time;

  constructor(public dialogRef: MatDialogRef<AddNoteComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    flatpickrFactory();
    if (this.data.event != null) {
      this.dayOfNote = this.data.event.start;
      this.note.title = this.data.event.title;
      this.note.start = this.data.event.start;
      this.note.end = this.data.event.end;
    }
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      day: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
    });
  }

  // tslint:disable-next-line:typedef
  add() {
    this.dialogRef.close(this.note);
  }

  get title(): FormControl {
    return this.formGroup.get('title') as FormControl;
  }

  get day(): FormControl {
    return this.formGroup.get('day') as FormControl;
  }

  get start(): FormControl {
    return this.formGroup.get('start') as FormControl;
  }

  get end(): FormControl {
    return this.formGroup.get('end') as FormControl;
  }

  // tslint:disable-next-line:typedef
  onCancelClick() {
    this.dialogRef.close(null);
  }

}
