import { Observable } from 'rxjs'
import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { map, switchMap, tap } from 'rxjs/operators'

import { IAppState } from 'src/app/store/state/app.state'
import * as subjectSelectors from '../../store/selectors/subject.selector'
import { CorrectDoc } from 'src/app/models/plagiarism-result.model'
import * as filesActions from '../../store/actions/files.actions'
import * as catsActions from '../../store/actions/cats.actions'
import { UserFilesService } from 'src/app/services/user-files.service'
import { DialogData } from 'src/app/models/dialog-data.model'

@Component({
  selector: 'app-delete-popover',
  templateUrl: 'check-plagiarism-student.component.html',
  styleUrls: ['./check-plagiarism-student.component.less'],
})
export class CheckPlagiarismStudentComponent implements OnInit {
  plagResults$: Observable<CorrectDoc[]>

  displayedColumns = ['coeff', 'author', 'group', 'subject', 'file']

  constructor(
    public dialogRef: MatDialogRef<CheckPlagiarismStudentComponent>,
    private store: Store<IAppState>,
    private userFilesService: UserFilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogRef.disableClose = true
  }
  isLoading = false
  ngOnInit(): void {
    this.plagResults$ = this.store.select(subjectSelectors.getSubjectId).pipe(
      switchMap((subjectId) =>
        this.userFilesService.checkPlagiarism(
          subjectId,
          this.data.body.userFileId,
          this.data.body.isLab,
          this.data.body.isPractical
        )
      ),
      tap((response) => {
        catsActions.showMessage({ body: response })
        this.isLoading = true
      }),
      map((response) => response.DataD)
    )
  }

  onClick(): void {
    this.dialogRef.close()
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
