import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru';
import {Note} from '../../model/note.model';
import {MatDialogRef} from '@angular/material/dialog';

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

  constructor(public dialogRef: MatDialogRef<AddNoteComponent>) { }

  ngOnInit(): void {
    flatpickrFactory();
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
    });
  }

  // tslint:disable-next-line:typedef
  add() {
    this.dialogRef.close(this.note);
  }

  // tslint:disable-next-line:typedef
  onCancelClick() {
    this.dialogRef.close(null);
  }

}
