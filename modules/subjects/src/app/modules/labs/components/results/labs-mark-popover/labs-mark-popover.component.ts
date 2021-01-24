import { iif, Observable } from 'rxjs';
import {Component, Inject, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';

import {SubjectService} from '../../../../../services/subject.service';
import {validateDate} from '../../../../../shared/validators/date.validator';
import { Lector } from 'src/app/models/lector.model';
import { IAppState } from 'src/app/store/state/app.state';
import {DialogData} from '../../../../../models/dialog-data.model';
import * as subjectSelectors from '../../../../../store/selectors/subject.selector';
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

  markForm = new FormGroup({
    mark: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
    date: new FormControl(new Date(), [Validators.required, validateDate]),
    comment: new FormControl(''),
    showForStudent: new FormControl(false)
  });

  lector$: Observable<Lector>;

  constructor(
    public dialogRef: MatDialogRef<LabsMarkPopoverComponent>,
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
