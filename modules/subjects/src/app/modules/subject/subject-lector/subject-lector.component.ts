import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../models/dialog-data.model';
import {FormControl} from '@angular/forms';
import {SubjectService} from '../../../services/subject.service';
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../../store/selectors/subject.selector';
import {IAppState} from '../../../store/state/app.state';

@Component({
  selector: 'app-news-popover',
  templateUrl: './subject-lector.component.html',
  styleUrls: ['./subject-lector.component.less']
})
export class SubjectLectorComponent implements OnInit {

  public joinedLectors = [];
  public allLectors = [];
  public selectedLector;

  public subjectId;

  constructor(
    public dialogRef: MatDialogRef<SubjectLectorComponent>,
    public subjectService: SubjectService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.model.subjectId) {
      this.subjectId = this.data.model.subjectId;
      this.setLectors();
    } else {
      this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
        this.subjectId = subjectId;
        this.setLectors();
      })
    }
  }

  setLectors() {
    this.subjectService.getJoinedLector(this.subjectId).subscribe(res => {
      this.joinedLectors = res.Lectors;
    });
    this.subjectService.getNoAdjointLectors(this.subjectId).subscribe(res => {
      this.allLectors = res.Lectors;
    })
  }

  joinedLector() {
    this.subjectService.joinedLector(this.subjectId, this.selectedLector.LectorId).subscribe(res =>
      res.Code === "200" && this.setLectors()
    )
  }

  deletePopover(lector) {
    this.subjectService.disjoinLector(this.subjectId, lector.LectorId).subscribe(res =>
      res.Code === "200" && this.setLectors()
    )
  }

  _selectedLector(event) {
    if (event.isUserInput) {
      this.selectedLector = this.allLectors.find(res => res.LectorId === event.source.value);
    }
  }

}
