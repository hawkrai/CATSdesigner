import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
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
  userId: number;
  constructor(
    public dialogRef: MatDialogRef<SubjectLectorComponent>,
    public subjectService: SubjectService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private changeDetectorRef: ChangeDetectorRef) {
    this.dialogRef.disableClose = true;
  }

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.store.select(subjectSelectors.getUserId).subscribe(userId => {
      this.userId = userId;
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
    });
  }

  setLectors() {
    this.subjectService.getJoinedLector(this.subjectId).subscribe(lectors => {
      this.joinedLectors = this.sortLectors(lectors);
    });
    this.subjectService.getNoAdjointLectors(this.subjectId).subscribe(lectors => {
      this.allLectors = this.sortLectors(lectors);
    });
  }

  joinLector() {
    this.subjectService.joinedLector(this.subjectId, this.selectedLector.LectorId).subscribe(body => {
      if (body.Code === "200") {
        this.joinedLectors = this.sortLectors([...this.joinedLectors, this.selectedLector]);
        this.allLectors = this.sortLectors(this.allLectors.filter(x => x.LectorId !== this.selectedLector.LectorId));
        this.selectedLector = null;
        this.changeDetectorRef.detectChanges();
      }
      this.store.dispatch(catsActions.showMessage({ body }));
    });
  }

  disjoinLector(lector) {
    this.subjectService.disjoinLector(this.subjectId, lector.LectorId).subscribe(body => {
      if (body.Code === "200") {
        this.joinedLectors = this.sortLectors(this.joinedLectors.filter(x => x.LectorId !== lector.LectorId));
        this.allLectors = this.sortLectors([...this.allLectors, lector]);
      }
      this.store.dispatch(catsActions.showMessage({ body }));
    }
    );
  }

  selectLector(lector: Lector) {
    this.selectedLector = lector;
  }

  private sortLectors(lectors: Lector[]): Lector[] {
    return lectors.sort((a, b) => a.FullName < b.FullName ? -1: 1);
  }
}
