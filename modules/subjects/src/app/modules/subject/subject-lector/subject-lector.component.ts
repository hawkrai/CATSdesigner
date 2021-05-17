import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';

import {DialogData} from '../../../models/dialog-data.model';
import {SubjectService} from '../../../services/subject.service';
import * as subjectSelectors from '../../../store/selectors/subject.selector';
import {IAppState} from '../../../store/state/app.state';
import * as catsActions from '../../../store/actions/cats.actions';
import { Lector } from 'src/app/models/lector.model';

@Component({
  selector: 'app-news-popover',
  templateUrl: './subject-lector.component.html',
  styleUrls: ['./subject-lector.component.less']
})
export class SubjectLectorComponent implements OnInit {

  public selectedLector: Lector;
  joinedLectors: Lector[] = [];
  allLectors: Lector[] = [];

  public subjectId: number;

  constructor(
    public dialogRef: MatDialogRef<SubjectLectorComponent>,
    public subjectService: SubjectService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.model && this.data.model.subjectId) {
      this.subjectId = this.data.model.subjectId;
      this.setLectors();
    } else {
      this.store.select(subjectSelectors.getSelectedSubject).subscribe(subject => {
        this.subjectId = subject.id;
        this.data.body = subject;
        this.setLectors();
      })
    }
  }

  setLectors() {
    this.subjectService.getJoinedLector(this.subjectId).subscribe(lectors => {
      this.joinedLectors = lectors;
    });
    this.subjectService.getNoAdjointLectors(this.subjectId).subscribe(lectors => {
      this.allLectors = lectors;
    });
  }

  joinedLector() {
    this.subjectService.joinedLector(this.subjectId, this.selectedLector.LectorId).subscribe(body => {
      if (body.Code === "200") {
        this.setLectors();
        this.store.dispatch(catsActions.showMessage({ body }));
      }
    });
  }

  deletePopover(lector) {
    this.subjectService.disjoinLector(this.subjectId, lector.LectorId).subscribe(body => {
      if (body.Code === "200") {
        this.setLectors();
        this.store.dispatch(catsActions.showMessage({ body }));
      }
    }
    )
  }

  selectLector(lector: Lector) {
    this.selectedLector = lector;
  }

}
