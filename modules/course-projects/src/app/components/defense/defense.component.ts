import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
import { MatDialog } from '@angular/material';
import { AddJobDialogComponent } from './add-project-dialog/add-job-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CheckPlagiarismStudentComponent } from './check-plagiarism-student/check-plagiarism-student.component';
import { CheckPlagiarismPopoverComponent } from '../../shared/check-plagiarism-popover/check-plagiarism-popover.component';
import { TranslatePipe } from 'educats-translate';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['./defense.component.less'],
})
export class DefenseComponent implements OnInit {
  @Input() courseUser: CourseUser;
  @Output() newWorkEvent = new EventEmitter<boolean>();

  public groups: (CoreGroup & { hasNewWork?: boolean })[] = [];
  public allGroups: (CoreGroup & { hasNewWork?: boolean })[] = [];
  public selectedGroup: (CoreGroup & { hasNewWork?: boolean }) | null = null;

  public userLabFiles: UserLabFile[] = [];
  public studentFiles: (StudentFilesModel & { hasNewWork?: boolean })[] = [];
  public detachedGroup = false;
  public canAddJob = false;

  private subjectId: string;

  constructor(
    private groupService: GroupService,
    private labFilesService: LabFilesService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe((subjectId) => {
      this.subjectId = subjectId;

      if (this.courseUser.IsStudent) {
        this.loadStudentFiles();
      } else if (this.courseUser.IsLecturer) {
        this.retrieveGroupsAndFiles(false);
      }
    });
  }

  private loadStudentFiles() {
    this.labFilesService
      .getCourseProjectFilesForUser(this.subjectId, this.courseUser.UserId)
      .subscribe((res) => {
        if (res && res.UserLabFiles) {
          this.userLabFiles = res.UserLabFiles;
          this.canAddJob = !this.userLabFiles.find((file) => !file.IsReturned);
        } else {
          this.canAddJob = true;
        }
      });
  }

  retrieveGroupsAndFiles(groupStatusChanged: boolean) {
    const getGroups$ = this.detachedGroup
      ? this.groupService.getDetachedGroups(this.subjectId)
      : this.groupService.getGroups(this.subjectId);

    getGroups$.subscribe((res) => {
      this.groups = (res && res.Groups ? res.Groups : []).map((g) => ({
        ...g,
        hasNewWork: false,
      }));
      this.allGroups = this.groups.slice(0);

      if (!this.selectedGroup || groupStatusChanged) {
        this.selectedGroup = this.groups.length > 0 ? this.groups[0] : null;
      }

      this.checkAllGroupsForNewWork();

      if (this.selectedGroup) {
        this.retrieveFiles();
      }
    });
  }

  retrieveFiles() {
    if (!this.selectedGroup) return;

    this.labFilesService
      .getCourseProjectFiles({
        isCp: true,
        subjectId: this.subjectId,
        groupId: this.selectedGroup.GroupId,
      })
      .subscribe((res) => {
        if (!res || !res.Students) {
          this.studentFiles = [];
          this.updateGroupHasNewWork();
          return;
        }

        var mappedStudents: (StudentFilesModel & { hasNewWork?: boolean })[] =
          [];

        for (var i = 0; i < res.Students.length; i++) {
          var student = res.Students[i];
          var hasNewWork = false;

          if (student.FileLabs && student.FileLabs.length > 0) {
            hasNewWork = student.FileLabs.some(function (file) {
              return !file.IsReceived && !file.IsReturned;
            });
          }

          mappedStudents.push(Object.assign({}, student, { hasNewWork: hasNewWork }));
        }

        this.studentFiles = mappedStudents;

        this.updateGroupHasNewWork();
        this.emitGlobalWorkStatus();
      });
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(
        (g) => g.GroupId === event.source.value
      );
      this.retrieveFiles();
    }
  }

  groupStatusChange(event) {
    this.detachedGroup = event.checked;
    this.retrieveGroupsAndFiles(true);
  }

  checkAllGroupsForNewWork() {
    if (!this.courseUser.IsLecturer || !this.groups || !this.groups.length)
      return;

    const requests = this.groups.map((g) =>
      this.labFilesService.getCourseProjectFiles({
        isCp: true,
        subjectId: this.subjectId,
        groupId: g.GroupId,
      })
    );

    forkJoin(requests).subscribe((results) => {
      for (var i = 0; i < results.length; i++) {
        var res = results[i];
        var hasNewWork = false;

        if (res && res.Students && res.Students.length > 0) {
          hasNewWork = res.Students.some(function (s) {
            if (s.FileLabs && s.FileLabs.length > 0) {
              return s.FileLabs.some(function (f) {
                return !f.IsReceived && !f.IsReturned;
              });
            }
            return false;
          });
        }

        this.groups[i].hasNewWork = !!hasNewWork;
      }

      this.emitGlobalWorkStatus();
    });
  }

  updateStudentJobs(studentId: string) {
  let index = -1;

  for (let i = 0; i < this.studentFiles.length; i++) {
    if (this.studentFiles[i].StudentId === studentId) {
      index = i;
      break;
    }
  }

  if (index === -1) return;

  this.labFilesService
    .getCourseProjectFilesForUser(this.subjectId, studentId)
    .subscribe((res) => {
      const newLabs = res && res.UserLabFiles ? res.UserLabFiles : [];

      const hasNew = newLabs.some(f => !f.IsReceived && !f.IsReturned);

      const updatedStudent = {
        ...this.studentFiles[index],
        FileLabs: newLabs,
        hasNewWork: hasNew
      };

      this.studentFiles = [
        ...this.studentFiles.slice(0, index),
        updatedStudent,
        ...this.studentFiles.slice(index + 1)
      ];

      this.updateGroupHasNewWork();

      this.updateGlobalWorkStatusForAllGroups();
    });
}


  updateGroupHasNewWork() {
    if (!this.selectedGroup || !this.studentFiles) return;

    var groupHasNew = false;

    for (var i = 0; i < this.studentFiles.length; i++) {
      var s = this.studentFiles[i];
      if (s.FileLabs && s.FileLabs.length > 0) {
        var found = s.FileLabs.some(function (f) {
          return !f.IsReceived && !f.IsReturned;
        });
        if (found) {
          groupHasNew = true;
          break;
        }
      }
    }

    this.selectedGroup.hasNewWork = groupHasNew;

    for (var j = 0; j < this.groups.length; j++) {
      if (this.groups[j].GroupId === this.selectedGroup.GroupId) {
        this.groups[j].hasNewWork = groupHasNew;
        break;
      }
    }

    for (var k = 0; k < this.allGroups.length; k++) {
      if (this.allGroups[k].GroupId === this.selectedGroup.GroupId) {
        this.allGroups[k].hasNewWork = groupHasNew;
        break;
      }
    }

    this.emitGlobalWorkStatus();
  }

  updateGlobalWorkStatusForAllGroups() {
    if (!this.allGroups || this.allGroups.length === 0) return;

    const requests = this.allGroups.map((group) =>
      this.labFilesService.getCourseProjectFiles({
        isCp: true,
        subjectId: this.subjectId,
        groupId: group.GroupId,
      })
    );

    forkJoin(requests).subscribe((results) => {
      for (var i = 0; i < results.length; i++) {
        var res = results[i];
        var hasNewWork = false;

        if (res && res.Students && res.Students.length > 0) {
          hasNewWork = res.Students.some(function (s) {
            if (s.FileLabs && s.FileLabs.length > 0) {
              return s.FileLabs.some(function (f) {
                return !f.IsReceived && !f.IsReturned;
              });
            }
            return false;
          });
        }

        this.allGroups[i].hasNewWork = !!hasNewWork;

        for (var j = 0; j < this.groups.length; j++) {
          if (this.groups[j].GroupId === this.allGroups[i].GroupId) {
            this.groups[j].hasNewWork = !!hasNewWork;
            break;
          }
        }
      }

      this.emitGlobalWorkStatus();
    });
  }

  emitGlobalWorkStatus() {
    var any = false;
    for (var i = 0; i < this.allGroups.length; i++) {
      if (this.allGroups[i].hasNewWork) {
        any = true;
        break;
      }
    }
    this.newWorkEvent.emit(any);
  }

  addJob(userLabFile?: UserLabFile, studentId?: string) {
    const body =
      userLabFile && this.courseUser.IsStudent
        ? {
            comments: userLabFile.Comments,
            attachments: userLabFile.Attachments,
          }
        : { comments: '', attachments: [] };

    const dialogRef = this.dialog.open(AddJobDialogComponent, {
      width: '550px',
      data: {
        title: this.translatePipe.transform(
          'text.course.defence.dialog.title',
          'На защиту курсового проекта'
        ),
        buttonText: this.translatePipe.transform(
          'text.course.defence.dialog.action',
          'Отправить'
        ),
        body,
        model: this.translatePipe.transform(
          'text.course.defence.dialog.comment',
          'Комментарий'
        ),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.uploadJob(result, studentId || this.courseUser.UserId, userLabFile);
      }
    });
  }

  uploadJob(dialogResult: any, studentId: string, userLabFile?: UserLabFile) {
    const isLecturer = this.courseUser.IsLecturer;

    var attachmentId = '0';
    if (
      dialogResult &&
      dialogResult.uploadedFile &&
      dialogResult.uploadedFile.IdFile &&
      dialogResult.uploadedFile.IdFile !== -1
    ) {
      attachmentId = dialogResult.uploadedFile.IdFile;
    }

    var fileName = '';
    if (dialogResult && dialogResult.uploadedFile) {
      fileName =
        dialogResult.uploadedFile.Name ||
        (dialogResult.uploadedFile.OriginalName
          ? dialogResult.uploadedFile.OriginalName
          : dialogResult.uploadedFile.FileName || '');
    }

    var guidFileName = '';
    if (dialogResult && dialogResult.uploadedFile) {
      guidFileName =
        dialogResult.uploadedFile.GuidFileName || dialogResult.uploadedFile.FileName || '';
    }

    const payload = {
      attachments:
        '[{"Id":' +
        attachmentId +
        ',"Title":"","Name":"' +
        fileName +
        '","AttachmentType":"Document","FileName":"' +
        guidFileName +
        '"}]',
      comments: dialogResult ? dialogResult.comments : '',
      id: !userLabFile || isLecturer ? '0' : userLabFile.Id,
      isCp: true,
      isRet: isLecturer,
      pathFile: userLabFile ? userLabFile.PathFile : '',
      subjectId: this.subjectId,
      userId: studentId,
    };

    this.labFilesService.sendJob(payload).subscribe((res) => {

      if (isLecturer) this.updateStudentJobs(studentId);
      else this.ngOnInit();

      this.updateGroupHasNewWork();
      this.updateGlobalWorkStatusForAllGroups();

      this.canAddJob = false;

      this.toastr.success(
        isLecturer
          ? this.translatePipe.transform(
              'text.course.defence.dialog.correct',
              'Работа отправлена для исправления'
            )
          : this.translatePipe.transform(
              'text.course.defence.dialog.success',
              'Работа успешно добавлена'
            )
      );
    }, (err) => {
      console.error('[UPLOAD JOB] error:', err);
    });
  }

  deleteJob(userLabFile: UserLabFile) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        label: this.translatePipe.transform(
          'text.course.defence.dialog.delete.label',
          'Удаление работы'
        ),
        message: this.translatePipe.transform(
          'text.course.defence.dialog.delete.message',
          'Вы действительно хотите удалить работу?'
        ),
        actionName: this.translatePipe.transform(
          'text.course.defence.dialog.delete.action',
          'Удалить'
        ),
        color: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.labFilesService.deleteJob(userLabFile.Id).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  approveJob(fileLab: UserLabFile, studentId: string) {
    this.labFilesService.approveJob(fileLab.Id).subscribe(() => {
      fileLab.IsReceived = true;
      this.updateStudentJobs(studentId);
      this.updateGroupHasNewWork();
    });
  }

  restoreFromArchive(fileLab: UserLabFile, studentId: string) {
    this.labFilesService.restoreFromArchive(fileLab.Id).subscribe(() => {
      fileLab.IsReceived = false;
      this.updateStudentJobs(studentId);
      this.updateGroupHasNewWork();
    });
  }

  checkPlagiarism() {
    this.dialog.open(CheckPlagiarismPopoverComponent, {
      data: { body: this.subjectId },
    });
  }

  checkPlagiarismFile(file) {
    this.dialog.open(CheckPlagiarismStudentComponent, {
      data: { body: { subjectId: this.subjectId, userFileId: file.Id } },
    });
  }
}
