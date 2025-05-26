import { finalize, map, switchMap, tap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { PlagiarismResultSubject } from './../../models/plagiarism-result-subject.model'
import { Component, Inject} from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { IAppState } from 'src/app/store/state/app.state'
import * as subjectSelectors from '../../store/selectors/subject.selector'
import * as filesActions from '../../store/actions/files.actions'
import * as catsActions from '../../store/actions/cats.actions'
import { CorrectDoc } from 'src/app/models/plagiarism-result.model'
import { UserFilesService } from 'src/app/services/user-files.service'
import { DialogData } from 'src/app/models/dialog-data.model'
import { TranslatePipe } from 'educats-translate'
import { CatsService } from 'src/app/services/cats.service'
import { ErrorCode } from 'src/app/services/ErrorCode'

@Component({
  selector: 'app-delete-popover',
  templateUrl: 'check-plagiarism-popover.component.html',
  styleUrls: ['./check-plagiarism-popover.component.less'],
})
export class CheckPlagiarismPopoverComponent {
  labelPosition: '0' | '1' = '0'
  percent = 50
  loading = false
  result$: Observable<PlagiarismResultSubject[]>
  displayedColumns = ['author', 'group', 'subject', 'themelab', 'file', 'filesize']

  constructor(
    private dialogRef: MatDialogRef<CheckPlagiarismPopoverComponent>,
    private store: Store<IAppState>,
    private userFilesService: UserFilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translatePipe: TranslatePipe,
    private catsService: CatsService 
  ) {}

  onClick(): void {
    this.dialogRef.close()
  }

  onSave() {
    this.loading = true
    this.result$ = this.store.select(subjectSelectors.getSubjectId).pipe(
      switchMap((subjectId) =>
        this.userFilesService.checkPlagiarismSubjects({
          threshold: this.percent.toString(),
          subjectId,
          type: this.labelPosition,
          isLab: this.data.body.isLab,
          isPractical: this.data.body.isPractical,
        })
      ),
      tap((response) => {
        this.loading = false;

        if (response.Code === ErrorCode.NoAcceptedWorks) {
          this.catsService.showMessage({
            Message: this.translatePipe.transform(
              'plagiarismCheck.noAcceptedWorks',
              'Отсутствуют принятые работы для проверки на плагиат'
            ),
            Code: ErrorCode.NoAcceptedWorks,
          });
        } else if (response.Code === ErrorCode.Success) {
          this.catsService.showMessage({
            Message: this.translatePipe.transform(
              'plagiarismCheck.success',
              'Проверка прошла успешно'
            ),
            Code: ErrorCode.Success,
          });
        }        
      }),
      finalize(() => {
        this.loading = false
      }),
      map((response) => response.DataD)
    )
  }

  downloadFile(plagResult: CorrectDoc): void {
    this.store.dispatch(
      filesActions.downloadFile({
        pathName: plagResult.DocPathName,
        fileName: plagResult.DocFileName,
      })
    )
  }
}