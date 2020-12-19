import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PlagiarismResultSubject } from './../../models/plagiarism-result-subject.model';
import { LabsRestService } from 'src/app/services/labs/labs-rest.service';
import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { IAppState } from "src/app/store/state/app.state";
import * as subjectSelectors from '../../store/selectors/subject.selector';
import * as filesActions from '../../store/actions/files.actions';
import { CorrectDoc } from 'src/app/models/plagiarism-result.model';

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
    private labsService: LabsRestService
  ) {}

  onClick(): void {
    this.dialogRef.close();
  }
  onSave() {
    this.loading = true;
    this.result$ = this.store.select(subjectSelectors.getSubjectId).pipe(
      switchMap(subjectId => this.labsService.checkPlagiarismSubjects({ threshold: this.percent.toString(), subjectId, type: this.labelPosition })),
      tap(() => this.loading = false)
      );
  }

  downloadFile(plagResult: CorrectDoc): void {
    this.store.dispatch(filesActions.downloadFile({ pathName: plagResult.DocPathName, fileName: plagResult.DocFileName }));
  }
}
