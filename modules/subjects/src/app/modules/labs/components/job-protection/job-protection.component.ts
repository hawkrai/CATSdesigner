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
import * as subjectActions from '../../.././../store/selectors/subject.selector';
import { attachmentConverter } from 'src/app/utils';
import { CheckPlagiarismStudentComponent } from './check-plagiarism-student/check-plagiarism-student.component';
import { DeletePopoverComponent } from 'src/app/shared/delete-popover/delete-popover.component';

@Component({
  selector: 'app-job-protection',
  templateUrl: './job-protection.component.html',
  styleUrls: ['./job-protection.component.less']
})
export class JobProtectionComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isTeacher: boolean;
  @Input() groupId: number;

  public openedPanelId = 0;
  private subs = new SubSink();

  public displayedColumns = ['files', 'comments', 'date', 'action'];
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
      } else {
        this.store.dispatch(labsActions.loadUserLabsFiles());
      }
    }
  }

  ngOnInit(): void {
    this.state$ = combineLatest(
      this.store.select(labsSelectors.getStudentsLabsFiles),
      this.store.select(labsSelectors.getUserLabsFiles)
    ).pipe(
      map(([students, files]) => ({ students, files }))
    );
  }

  hasNewLabs(student: StudentMark): boolean {
    return student.FileLabs.some(this.isNewFile);
  }

  isNewFile = (file: UserLabFile): boolean => {
    return  (this.isTeacher && !file.IsReturned && !file.IsReceived) || (!this.isTeacher && file.IsReturned);
  }

  downloadFile(attachment : Attachment): void {
    this.store.dispatch(filesActions.downloadFile({ pathName: attachment.PathName, fileName: attachment.FileName }));
  }

  addLab(file: UserLabFile, studentId?: number): void {
    let model = {comment: '', attachments: [], isTeacher: false };
    if (!this.isTeacher && file) {
      model = { comment: file.Comments, attachments: file.Attachments.map(f => attachmentConverter(f)), isTeacher: this.isTeacher }
    }
    const dialogData: DialogData = {
      title: this.isTeacher ? 'Загрузить исправленный вариант работы' : 'На защиту лабораторной работы',
      buttonText: 'Отправить работу',
      body: this.isTeacher ? 'Комментарий (необязательно)' : 'Комментарий (Например, Лабораторная работа №1)',
      model
    };
    const dialogRef = this.dialogService.openDialog(AddLabPopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(data => !!data),
        withLatestFrom(this.store.select(subjectActions.getUserId)),
        map(([data, userId]: [{ comments: string, attachments: Attachment[]}, string]) => this.getSendFile(data, file, studentId ? studentId : +userId))
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

  deleteLabWork(userFileId: number ) {
    const dialogData: DialogData = {
      title: 'Удаление работы',
      body: 'работу',
      buttonText: 'Удалить'
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().pipe(
        filter(result => !!result)
      ).subscribe(() => {
        this.store.dispatch(labsActions.deleteUserFile({ userFileId }));
      })
    );
  }

  getSendFile(data: { comments: string, attachments: Attachment[] }, file: UserLabFile, userId: number) {
    console.log(data);
    return {
      attachments: JSON.stringify(data.attachments),
      comments: data.comments,
      id: file ? file.Id : 0,
      isCp: false,
      isRet: this.isTeacher,
      pathFile: file ? file.PathFile : '',
      userId
    }
  }

}
