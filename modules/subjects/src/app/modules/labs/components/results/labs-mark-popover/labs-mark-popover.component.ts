import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../../models/dialog-data.model';
import {DatePipe} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {IAppState} from '../../../../../store/state/app.state';
import {Store} from '@ngrx/store';
import {SubjectService} from '../../../../../services/subject.service';
import {merge, Observable} from 'rxjs';

import * as subjectSelectors from '../../../../../store/selectors/subject.selector';
import {map, switchMap} from 'rxjs/operators';
import {Lector} from '../../../../../models/lector.model';
import {validateDate} from '../../../../../shared/validators/date.validator';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-news-popover',
  templateUrl: './labs-mark-popover.component.html',
  styleUrls: ['./labs-mark-popover.component.less'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class LabsMarkPopoverComponent implements OnInit {
  joinedLectors$: Observable<Lector[]>;

  datepickerFilter(d: Date | null): boolean {
    return d <= new Date();
  }

  markForm = new FormGroup({
    lector: new FormControl('', [Validators.required]),
    mark: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
    date: new FormControl(new Date(), [Validators.required, validateDate]),
    comment: new FormControl('')
  })

  constructor(
    public dialogRef: MatDialogRef<LabsMarkPopoverComponent>,
    private store: Store<IAppState>,
    private subjectService: SubjectService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe) {

    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.joinedLectors$ = this.store.select(subjectSelectors.getSubjectId).pipe(
      switchMap(id => this.subjectService.getJoinedLector(id).pipe(
        map(r => r.Lectors as Lector[])
      ))
    );
  }

  onClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.markForm.invalid) {
      return;
    }
    this.markForm.patchValue({
      date: this.setDate(this.markForm.get('date').value)
    });
    console.log(this.markForm.value)
    this.dialogRef.close(this.markForm.value);
  }

  setDate(date: string): string {
    const format = 'dd.MM.yyyy';
    return this.datePipe.transform(date, format);
  }

}
