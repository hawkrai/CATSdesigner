import { Component, Input, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../../store/state/app.state';
import { getSubjectId } from '../../store/selectors/subject.selector';
import { CourseUser } from '../../models/course-user.model';
import { UserLabFile } from '../../models/user-lab-file';
import { LabFilesService } from '../../services/lab-files-service';
import { StudentFilesModel } from '../../models/student-files.model';
import { GroupService } from '../../services/group.service';
import { CoreGroup } from '../../models/core-group.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddJobDialogComponent } from './add-project-dialog/add-job-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CheckPlagiarismStudentComponent } from './check-plagiarism-student/check-plagiarism-student.component';
import {
  CheckPlagiarismPopoverComponent
} from '../../shared/check-plagiarism-popover/check-plagiarism-popover.component';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['./defense.component.less']
})
export class DefenseComponent implements OnInit {

  @Input() courseUser: CourseUser;

  public groups: CoreGroup[];
  public selectedGroup: CoreGroup;
  public userLabFiles: UserLabFile[];
  public studentFiles: StudentFilesModel[];
  public detachedGroup = false;
  public canAddJob = false;

  private subjectId: string;

  constructor(private groupService: GroupService,
    private labFilesService: LabFilesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translatePipe: TranslatePipe,
    private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      if (this.courseUser.IsStudent) {
        this.labFilesService.getCourseProjectFilesForUser(this.subjectId, this.courseUser.UserId)
          .subscribe(res => {
            if (res.UserLabFiles) {
              this.userLabFiles = res.UserLabFiles;
              if (!this.userLabFiles.find(file => !file.IsReturned)) {
                this.canAddJob = true;
              }
            } else {
              this.canAddJob = true;
            }
          });
      } else if (this.courseUser.IsLecturer) {
        this.retrieveGroupsAndFiles(false);
      }
    });
  }

  retrieveFiles() {
    this.studentFiles = null;
    this.labFilesService.getCourseProjectFiles({
      isCp: true,
      subjectId: this.subjectId,
      groupId: this.selectedGroup.GroupId
    })
      .subscribe(res => this.studentFiles = res.Students);
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.GroupId === event.source.value);
      this.retrieveFiles();
    }
  }

  groupStatusChange(event) {
    this.detachedGroup = event.checked;
    this.retrieveGroupsAndFiles(true);
  }

  retrieveGroupsAndFiles(groupStatusChanged: boolean) {
    this.studentFiles = null;
    if (this.detachedGroup) {
      this.groupService.getDetachedGroups(this.subjectId).subscribe(res => {
        this.processGroupsResponse(res, groupStatusChanged);
      });
    } else {
      this.groupService.getGroups(this.subjectId).subscribe(res => {
        this.processGroupsResponse(res, groupStatusChanged);
      });
    }
  }

  processGroupsResponse(res: any, groupStatusChanged: boolean) {
    this.groups = res.Groups;
    if (this.selectedGroup == null || groupStatusChanged) {
      if (this.groups.length > 0) {
        this.selectedGroup = this.groups[0];
      } else {
        this.selectedGroup = null;
      }
    }
  }

  downloadArchive() {
    const url = 'http://localhost:8080/Subject/';
    location.href = url + 'GetZipLabs?id=' + this.selectedGroup.GroupId + '&subjectId=' + this.subjectId;
  }

  addJob(userLabFile?: UserLabFile, studentId?: string) {
    const body = userLabFile && this.courseUser.IsStudent ? {
      comments: userLabFile.Comments,
      attachments: userLabFile.Attachments
    }
      : { comments: '', attachments: [] };
    const dialogRef = this.dialog.open(AddJobDialogComponent, {
      width: '650px',
      data: {
        title: this.translatePipe.transform('text.course.defence.dialog.title', 'На защиту курсового проекта'),
        buttonText: this.translatePipe.transform('text.course.defence.dialog.action', 'Отправить работу'),
        body,
        model: this.translatePipe.transform('text.course.defence.dialog.comment', 'Комментарий')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.courseUser.IsLecturer) {
          this.labFilesService.deleteJob(userLabFile.Id).subscribe(() => this.uploadJob(result, studentId, userLabFile));
        } else {
          this.uploadJob(result, this.courseUser.UserId, userLabFile);
        }
      }
    });
  }

  uploadJob(dialogResult: any, studentId: string, userLabFile?: UserLabFile) {
    const isRet = this.courseUser.IsLecturer;
    const attachmentId = dialogResult.uploadedFile.IdFile && dialogResult.uploadedFile.IdFile !== -1
      ? dialogResult.uploadedFile.IdFile : '0';
    this.labFilesService.sendJob({
      attachments: '[{"Id":' + attachmentId + ',"Title":"","Name":"' + dialogResult.uploadedFile.Name + '","AttachmentType":"' +
        dialogResult.uploadedFile.Type + '","FileName":"' + dialogResult.uploadedFile.GuidFileName + '"}]',
      comments: dialogResult.comments,
      id: !userLabFile || isRet ? '0' : userLabFile.Id,
      isCp: true,
      isRet,
      pathFile: userLabFile ? userLabFile.PathFile : '',
      subjectId: this.subjectId,
      userId: studentId
    })
      .subscribe(() => {
        if (isRet) {
          this.updateStudentJobs(studentId);
        } else {
          this.ngOnInit();
        }
        this.canAddJob = false;
        this.addFlashMessage(isRet ?
          this.translatePipe.transform('text.course.defence.dialog.correct', 'Работа отправлена для исправления') :
          this.translatePipe.transform('text.course.defence.dialog.success', 'Работа успешно добавлена'));
      });
  }

  updateStudentJobs(studentId: string) {
    const jobs = this.studentFiles.find(files => files.StudentId === studentId);
    this.labFilesService.getCourseProjectFilesForUser(this.subjectId, studentId)
      .subscribe(res => jobs.FileLabs = res.UserLabFiles);
  }

  deleteJob(userLabFile: UserLabFile) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        label: this.translatePipe.transform('text.course.defence.dialog.delete.label', 'Удаление работы'),
        message: this.translatePipe.transform('text.course.defence.dialog.delete.message', 'Вы действительно хотите удалить работу?'),
        actionName: this.translatePipe.transform('text.course.defence.dialog.delete.action', 'Удалить'),
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.labFilesService.deleteJob(userLabFile.Id)
          .subscribe(() => {
            this.ngOnInit();
            this.addFlashMessage(this.translatePipe.transform('text.course.defence.dialog.delete.success', 'Работа удалена'));
          });
      }
    });
  }

  approveJob(fileLab: UserLabFile, studentId: string) {
    this.labFilesService.approveJob(fileLab.Id)
      .subscribe(() => {
        this.updateStudentJobs(studentId);
        this.addFlashMessage(this.translatePipe.transform('text.course.defence.dialog.approve.success', 'Файл перемещен в архив'));
      });
  }

  restoreFromArchive(fileLab: UserLabFile, studentId: string) {
    this.labFilesService.restoreFromArchive(fileLab.Id)
      .subscribe(() => {
        this.updateStudentJobs(studentId);
        this.addFlashMessage(this.translatePipe.transform('text.course.defence.dialog.restore.success', 'Файл перемещен из архива'));
      });
  }

  checkPlagiarism() {
    this.dialog.open(CheckPlagiarismPopoverComponent, {
      data: {
        body: this.subjectId
      }
    });
  }

  checkPlagiarismFile(file) {
    this.dialog.open(CheckPlagiarismStudentComponent, {
      data: {
        body: { subjectId: this.subjectId, userFileId: file.Id }
      }
    });
  }

  addFlashMessage(msg: string) {
    this.snackBar.open(msg, null, {
      duration: 2000
    });
  }
}
