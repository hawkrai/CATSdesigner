import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { iif, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDialogRef, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { DialogData } from 'src/app/models/dialog-data.model';
import { Lector } from 'src/app/models/lector.model';
import { SubjectService } from 'src/app/services/subject.service';
import { IAppState } from 'src/app/store/state/app.state';
import { validateDate } from '../validators/date.validator';

import * as subjectSelectors from '../../store/selectors/subject.selector';
import { switchMap } from 'rxjs/operators';

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
  selector: 'app-mark-popover',
  templateUrl: './mark-popover.component.html',
  styleUrls: ['./mark-popover.component.less'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MarkPopoverComponent implements OnInit {

  markForm = new FormGroup({
    mark: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
    date: new FormControl(new Date(), [Validators.required, validateDate]),
    comment: new FormControl(''),
    showForStudent: new FormControl(false)
  });

  lector$: Observable<Lector>;

  constructor(
    public dialogRef: MatDialogRef<MarkPopoverComponent>,
    private subjectService: SubjectService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {

    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.lector$ = iif(() => this.data.model.lecturerId, 
    this.subjectService.getLector(this.data.model.lecturerId),
    this.store.select(subjectSelectors.getUser).pipe(
      switchMap(user => this.subjectService.getLector(+user.id))
    )) ;
    Object.keys(this.markForm.controls).forEach(k => {
      this.markForm.patchValue({ [k]: this.data.body[k] });
    });
  }

  onClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.markForm.invalid) {
      return;
    }
    console.log(this.markForm.value);
    this.dialogRef.close(this.markForm.value);
  }
}