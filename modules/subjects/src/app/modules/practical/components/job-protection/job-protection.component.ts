import { DialogService } from 'src/app/services/dialog.service'
import { SubSink } from 'subsink'
import { Component, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import { IAppState } from '../../../../store/state/app.state'
import { DialogData } from '../../../../models/dialog-data.model'
import { AddPracticalPopoverComponent } from './add-practical-popover/add-practical-popover.component'
import { filter, map, withLatestFrom } from 'rxjs/operators'
import { Attachment } from 'src/app/models/file/attachment.model'
import { UserLabFile } from 'src/app/models/user-lab-file.model'

import * as practicalsActions from '../../../../store/actions/practicals.actions'
import * as subjectSelectors from '../../.././../store/selectors/subject.selector'
import * as groupsSelectors from '../../../../store/selectors/groups.selectors'
import { DeletePopoverComponent } from 'src/app/shared/delete-popover/delete-popover.component'
import { TranslatePipe } from 'educats-translate'
import { combineLatest } from 'rxjs'
import { CheckPlagiarismStudentComponent } from 'src/app/shared/check-plagiarism-student/check-plagiarism-student.component'

@Component({
  selector: 'app-job-protection',
  templateUrl: './job-protection.component.html',
  styleUrls: ['./job-protection.component.less'],
})
export class JobProtectionComponent implements OnDestroy {
  private subs = new SubSink()
  isTeacher: boolean

  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      combineLatest([
        this.store.select(groupsSelectors.getCurrentGroup),
        this.store.select(subjectSelectors.isTeacher),
      ]).subscribe(([group, isTeacher]) => {
        this.isTeacher = isTeacher
        if (group && isTeacher) {
          this.store.dispatch(practicalsActions.loadGroupJobProtection())
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  isNewFile = (file: UserLabFile): boolean => {
    return (
      (this.isTeacher && !file.IsReturned && !file.IsReceived) ||
      (!this.isTeacher && file.IsReturned)
    )
  }

  addPractical({
    userId,
    file,
    practicalId,
    fileId,
  }: {
    userId: number
    file: UserLabFile
    practicalId?: number
    fileId?: number
  }): void {
    const dialogData: DialogData = {
      title: this.isTeacher
        ? this.translate.transform(
            'text.subjects.labs.for.revision',
            'На доработку'
          )
        : this.translate.transform(
            'text.subjects.practicals.to.protect',
            'На защиту практической работы'
          ),
      buttonText: this.translate.transform('button.send', 'Отправить'),
      body: { isTeacher: this.isTeacher },
      model: {
        comments: file ? file.Comments : '',
        attachments: file ? file.Attachments : [],
        practicalId: practicalId ? practicalId : file ? file.PracticalId : 0,
        isTeacher: this.isTeacher,
      },
    }
    const dialogRef = this.dialogService.openDialog(
      AddPracticalPopoverComponent,
      dialogData
    )

    this.subs.add(
      dialogRef
        .afterClosed()
        .pipe(
          filter((data) => !!data),
          withLatestFrom(this.store.select(subjectSelectors.getUserId)),
          map(
            ([data, currentUserId]: [
              {
                comments: string
                attachments: Attachment[]
                practicalId: number
              },
              number
            ]) =>
              this.getSendFile(
                file,
                data,
                userId ? userId : currentUserId,
                !!practicalId
              )
          )
        )
        .subscribe((sendFile) => {
          this.store.dispatch(
            practicalsActions.sendUserFile({ sendFile, fileId })
          )
        })
    )
  }

  checkPlagiarism(userFileId: number): void {
    const dialogData: DialogData = {
      body: { userFileId, isPractical: true },
    }
    this.dialogService.openDialog(CheckPlagiarismStudentComponent, dialogData)
  }

  deletePractical(deleteRequest: {
    userLabFileId: number
    userId: number
    practicalId: number
  }): void {
    const dialogData: DialogData = {
      title: this.translate.transform(
        'text.subject.labs.work.deleting',
        'Удаление работы'
      ),
      body: this.translate.transform('work.accusative', 'работу'),
      buttonText: this.translate.transform('button.delete', 'Удалить'),
    }
    const dialogRef = this.dialogService.openDialog(
      DeletePopoverComponent,
      dialogData
    )

    this.subs.add(
      dialogRef
        .afterClosed()
        .pipe(
          filter((result) => !!result),
          withLatestFrom(this.store.select(subjectSelectors.getUserId))
        )
        .subscribe(([_, currentUserId]) => {
          deleteRequest.userId = deleteRequest.userId
            ? deleteRequest.userId
            : currentUserId
          this.store.dispatch(practicalsActions.deleteUserFile(deleteRequest))
        })
    )
  }

  getSendFile(
    file: UserLabFile,
    data: { comments: string; attachments: Attachment[]; practicalId: number },
    userId: number,
    isReturn: boolean = false
  ) {
    return {
      attachments: JSON.stringify(data.attachments),
      comments: data.comments ? data.comments : '',
      userId,
      practicalId: data.practicalId,
      id: isReturn ? 0 : file ? file.Id : 0,
      isRet: isReturn,
      pathFile: file ? file.PathFile : '',
    }
  }
}
