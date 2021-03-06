import { DialogService } from 'src/app/services/dialog.service';
import { SubSink } from 'subsink';
import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import {Store} from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import {IAppState} from '../../../../store/state/app.state';
import {DialogData} from '../../../../models/dialog-data.model';
import {AddLabPopoverComponent} from './add-lab-popover/add-lab-popover.component';
import {filter, map, withLatestFrom} from 'rxjs/operators';
import { StudentMark } from 'src/app/models/student-mark.model';
import { Attachment } from 'src/app/models/file/attachment.model';
import { UserLabFile } from 'src/app/models/user-lab-file.model';

import * as labsActions from '../../../../store/actions/labs.actions';
import * as labsSelectors from '../../../../store/selectors/labs.selectors';
import * as filesActions from '../../../../store/actions/files.actions';
import * as subjectSelectors from '../../.././../store/selectors/subject.selector';
import { attachmentConverter } from 'src/app/utils';
import { CheckPlagiarismStudentComponent } from './check-plagiarism-student/check-plagiarism-student.component';
import { DeletePopoverComponent } from 'src/app/shared/delete-popover/delete-popover.component';

@Component({
  selector: 'app-job-protection',
  templateUrl: './job-protection.component.html',
  styleUrls: ['./job-protection.component.less']
})
export class JobProtectionComponent implements OnChanges, OnDestroy {

  @Input() isTeacher: boolean;
  @Input() groupId: number;

  public openedPanelId = 0;
  private subs = new SubSink();

  state$: Observable<{ students: StudentMark[], files: UserLabFile[] }>;
   
  constructor(
    private store: Store<IAppState>,
    public dialogService: DialogService) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupId && changes.groupId.currentValue) {
      if (this.isTeacher) {
        this.store.dispatch(labsActions.loadStudentsLabsFiles());
      }
    }
  }

  hasNewLabs(student: StudentMark): boolean {
    return student.FileLabs.some(this.isNewFile);
  }

  isNewFile = (file: UserLabFile): boolean => {
    return  (this.isTeacher && !file.IsReturned && !file.IsReceived) || (!this.isTeacher && file.IsReturned);
  }

  addLab({ userId, file }: { userId: number, file: UserLabFile }): void {
    const dialogData: DialogData = {
      title: this.isTeacher ? 'Загрузить исправленный вариант работы' : 'На защиту лабораторной работы',
      buttonText: 'Отправить работу',
      body: { isTeacher : this.isTeacher },
      model: { comments: file ? file.Comments : '', attachments: file ? file.Attachments.map(a => attachmentConverter(a)) : [], labId: file ? file.LabId : 0 }
    };
    const dialogRef = this.dialogService.openDialog(AddLabPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(data => !!data),
        withLatestFrom(this.store.select(subjectSelectors.getUserId)),
        map(([data, currentUserId]: [{ comments: string, attachments: Attachment[],labId }, number]) => this.getSendFile(file, data, userId ? userId : currentUserId))
      ).subscribe(sendFile => {
        this.store.dispatch(labsActions.sendUserFile({ sendFile }));
      })
    );
  }

  cancelReceivedLabFile(userFileId: number): void {
    this.store.dispatch(labsActions.cancelLabFile({ userFileId }));
  }

  receiveLabFile(userFileId: number): void {
    this.store.dispatch(labsActions.receiveLabFile({ userFileId }));
  }

  checkPlagiarism(userFileId: number): void {
     const dialogData: DialogData = {
       body: { userFileId }
    };
    this.dialogService.openDialog(CheckPlagiarismStudentComponent, dialogData);
  }

  deleteLab(deleteRequest: { userLabFileId: number, userId: number, labId: number }): void {
    const dialogData: DialogData = {
      title: 'Удаление работы',
      body: 'работу',
      buttonText: 'Удалить'
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

  getSendFile(file: UserLabFile, data: { comments: string, attachments: Attachment[], labId: number }, userId: number) {
    return {
      attachments: JSON.stringify(data.attachments),
      comments: data.comments ? data.comments : '',
      isRet: this.isTeacher,
      userId,
      labId: data.labId,
      id: file ? file.Id : 0,
      pathFile: file ? file.PathFile : ''
    }
  }

}
