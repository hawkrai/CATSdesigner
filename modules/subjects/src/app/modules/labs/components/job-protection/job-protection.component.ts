import { DialogService } from 'src/app/services/dialog.service';
import { SubSink } from 'subsink';
import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {AddLabPopoverComponent} from './add-lab-popover/add-lab-popover.component';
import {filter, map, withLatestFrom} from 'rxjs/operators';
import { StudentMark } from 'src/app/models/student-mark.model';
import { Attachment } from 'src/app/models/file/attachment.model';
import { UserLabFile } from 'src/app/models/user-lab-file.model';

import * as labsActions from '../../../../store/actions/labs.actions';
import * as subjectSelectors from '../../.././../store/selectors/subject.selector';
import { CheckPlagiarismStudentComponent } from './check-plagiarism-student/check-plagiarism-student.component';
import { DeletePopoverComponent } from 'src/app/shared/delete-popover/delete-popover.component';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-job-protection',
  templateUrl: './job-protection.component.html',
  styleUrls: ['./job-protection.component.less']
})
export class JobProtectionComponent implements OnChanges, OnDestroy {

  @Input() isTeacher: boolean;
  @Input() groupId: number;

  private subs = new SubSink();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      if (this.isTeacher) {
        this.store.dispatch(labsActions.loadGroupJobProtection());
      }
    }
  }
  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe,
    public dialogService: DialogService,
    ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  hasNewLabs(student: StudentMark): boolean {
    return student.FileLabs.some(this.isNewFile);
  }

  isNewFile = (file: UserLabFile): boolean => {
    return  (this.isTeacher && !file.IsReturned && !file.IsReceived) || (!this.isTeacher && file.IsReturned);
  }

  addLab({ userId, file, labId, fileId }: { userId: number, file: UserLabFile, labId?: number, fileId?: number }): void {
    const dialogData: DialogData = {
      title: this.isTeacher ? this.translate.transform('text.subjects.labs.for.revision', 'На доработку') : this.translate.transform('text.subjects.labs.to.protect', 'На защиту лабораторной работы'),
      buttonText: this.translate.transform('button.send', 'Отправить'),
      body: { isTeacher : this.isTeacher },
      model: { 
        comments: file ? file.Comments : '', 
        attachments: file ? file.Attachments : [], 
        labId: labId ? labId : file ? file.LabId : 0,
        isTeacher: this.isTeacher
      }
    };
    const dialogRef = this.dialogService.openDialog(AddLabPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(data => !!data),
        withLatestFrom(this.store.select(subjectSelectors.getUserId)),
        map(([data, currentUserId]: [{ comments: string, attachments: Attachment[], labId: number }, number]) => this.getSendFile(file, data, userId ? userId : currentUserId, !!labId))
      ).subscribe(sendFile => {

        this.store.dispatch(labsActions.sendUserFile({ sendFile, fileId  }));
      })
    );
  }

  checkPlagiarism(userFileId: number): void {
     const dialogData: DialogData = {
       body: { userFileId }
    };
    this.dialogService.openDialog(CheckPlagiarismStudentComponent, dialogData);
  }

  deleteLab(deleteRequest: { userLabFileId: number, userId: number, labId: number }): void {
    const dialogData: DialogData = {
      title: this.translate.transform('text.subject.labs.work.deleting','Удаление работы'),
      body: this.translate.transform('work.accusative', 'работу'),
      buttonText: this.translate.transform('button.delete', 'Удалить')
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(result => !!result),
        withLatestFrom(this.store.select(subjectSelectors.getUserId))
      ).subscribe(([_, currentUserId]) => {
        deleteRequest.userId = deleteRequest.userId ? deleteRequest.userId : currentUserId;
        this.store.dispatch(labsActions.deleteUserLabFile(deleteRequest));
      })
    );
  }

  getSendFile(file: UserLabFile, data: { comments: string, attachments: Attachment[], labId: number }, userId: number, isReturn: boolean = false) {
    return {
      attachments: JSON.stringify(data.attachments),
      comments: data.comments ? data.comments : '',
      userId,
      labId: data.labId,
      id: isReturn ? 0 : file ? file.Id : 0,
      isRet: isReturn,
      pathFile: file ? file.PathFile : ''
    }
  }

}
