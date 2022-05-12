import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PlagiarismResultSubject } from './../../models/plagiarism-result-subject.model';
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { IAppState } from "src/app/store/state/app.state";
import * as subjectSelectors from '../../store/selectors/subject.selector';
import * as filesActions from '../../store/actions/files.actions';
import * as catsActions from '../../store/actions/cats.actions';
import { CorrectDoc } from 'src/app/models/plagiarism-result.model';
import { UserFilesService } from 'src/app/services/user-files.service';
import { DialogData } from 'src/app/models/dialog-data.model';

@Component({
  selector: 'app-delete-popover',
  templateUrl: 'check-plagiarism-popover.component.html',
  styleUrls: ['./check-plagiarism-popover.component.less']
})
export class CheckPlagiarismPopoverComponent {

  labelPosition: '0' | '1' = '0';
  percent = 50;
  loading = false;
  result$: Observable<PlagiarismResultSubject[]>;

  displayedColumns = ['author', 'group', 'subject', 'file'];

  constructor(
    private dialogRef: MatDialogRef<CheckPlagiarismPopoverComponent>,
    private store: Store<IAppState>,
    private userFilesService: UserFilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onClick(): void {
    this.dialogRef.close();
  }
  onSave() {
    this.loading = true;
    this.result$ = this.store.select(subjectSelectors.getSubjectId).pipe(
      switchMap(subjectId => this.userFilesService.checkPlagiarismSubjects({ threshold: this.percent.toString(), subjectId, type: this.labelPosition, isLab: this.data.body.isLab, isPractical: this.data.body.isPractical })),
      tap(response => {
        this.loading = false;
        this.store.dispatch(catsActions.showMessage({ body: response }));
      }),
      map(response => response.DataD)
    );
  }

  downloadFile(plagResult: CorrectDoc): void {
    this.store.dispatch(filesActions.downloadFile({ pathName: plagResult.DocPathName, fileName: plagResult.DocFileName }));
  }
}
