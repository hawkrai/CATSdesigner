import { Observable } from 'rxjs';
import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';

import { LabsRestService } from 'src/app/services/labs/labs-rest.service';
import { IAppState } from 'src/app/store/state/app.state';
import {DialogData} from '../../../../../models/dialog-data.model';
import * as subjectSelectors from '../../../../../store/selectors/subject.selector';
import { CorrectDoc } from 'src/app/models/plagiarism-result.model';
import * as filesActions from '../../../../../store/actions/files.actions';

@Component({
  selector: 'app-delete-popover',
  templateUrl: 'check-plagiarism-student.component.html',
  styleUrls: ['./check-plagiarism-student.component.less']
})
export class CheckPlagiarismStudentComponent implements OnInit {

  plagResults$: Observable<CorrectDoc[]>;

  displayedColumns = ['coeff', 'author', 'group', 'subject', 'file'];

  constructor(
    public dialogRef: MatDialogRef<CheckPlagiarismStudentComponent>,
    private store: Store<IAppState>,
    private labsService: LabsRestService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.plagResults$ = this.store.select(subjectSelectors.getSubjectId).pipe(
      switchMap(subjectId => this.labsService.checkPlagiarism(subjectId, this.data.body.userFileId))
    );
  }

  onClick(): void {
    this.dialogRef.close();
  }

  downloadFile(plagResult: CorrectDoc): void {
    this.store.dispatch(filesActions.downloadFile({ pathName: plagResult.DocPathName, fileName: plagResult.DocFileName }));
  }

}
