import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
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
import { forkJoin, interval, Subscription } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['./defense.component.less'],
})
export class DefenseComponent implements OnInit, OnDestroy {
  @Input() courseUser: CourseUser;
  @Output() newWorkEvent = new EventEmitter<boolean>();

  public groups: (CoreGroup & { hasNewWork?: boolean })[] = [];
  public allGroups: (CoreGroup & { hasNewWork?: boolean })[] = [];
  public selectedGroup: (CoreGroup & { hasNewWork?: boolean }) | null = null;

  public userLabFiles: UserLabFile[] = [];
  public studentFiles: (StudentFilesModel & { hasNewWork?: boolean; isExpanded?: boolean })[] = [];
  public detachedGroup = false;
  public canAddJob = false;
  public expandedStudentIds: Set<string> = new Set();

  private subjectId: string;
  private pollingSubscription: Subscription;
  private readonly POLLING_INTERVAL = 10000; 

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
        this.startPollingForStudent();
      } else if (this.courseUser.IsLecturer) {
        this.retrieveGroupsAndFiles(false);
        this.startPollingForLecturer();
      }
    });
  }

  ngOnDestroy() {
    this.stopPolling();
    this.expandedStudentIds.clear();
  }

  private startPollingForStudent() {
    this.stopPolling();
    
    this.pollingSubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => 
          this.labFilesService.getCourseProjectFilesForUser(
            this.subjectId, 
            this.courseUser.UserId
          )
        )
      )
      .subscribe((res) => {
        if (res && res.UserLabFiles) {
          const oldFiles = this.userLabFiles;
          this.userLabFiles = res.UserLabFiles;
          this.canAddJob = !this.userLabFiles.find((file) => !file.IsReturned);

          this.checkForStudentUpdates(oldFiles, res.UserLabFiles);
        } else {
          this.canAddJob = true;
        }
      });
  }

  private startPollingForLecturer() {
    this.stopPolling();
    
    this.pollingSubscription = interval(this.POLLING_INTERVAL)
      .subscribe(() => {
        if (this.selectedGroup) {
          this.retrieveFilesWithNotification();
        }
        this.checkAllGroupsForNewWork();
      });
  }

  private stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  private checkForStudentUpdates(oldFiles: UserLabFile[], newFiles: UserLabFile[]) {
    if (!oldFiles || oldFiles.length === 0) return;

    newFiles.forEach(newFile => {
      const oldFile = oldFiles.find(f => f.Id === newFile.Id);
      
      if (oldFile) {
        if (!oldFile.IsReceived && newFile.IsReceived) {
          this.toastr.success(
            this.translatePipe.transform(
              'text.course.defence.notification.approved',
              'Ваша работа принята преподавателем'
            )
          );
        }
        
        if (!oldFile.IsReturned && newFile.IsReturned) {
          this.toastr.warning(
            this.translatePipe.transform(
              'text.course.defence.notification.returned',
              'Работа возвращена на доработку'
            )
          );
        }
      }
    });
  }

  private retrieveFilesWithNotification() {
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

        const oldStudentFiles = this.studentFiles;
        const mappedStudents: (StudentFilesModel & { hasNewWork?: boolean; isExpanded?: boolean })[] = [];

        for (let i = 0; i < res.Students.length; i++) {
          const student = res.Students[i];
          let hasNewWork = false;

          if (student.FileLabs && student.FileLabs.length > 0) {
            hasNewWork = student.FileLabs.some(file => 
              !file.IsReceived && !file.IsReturned
            );
          }

          const isExpanded = this.expandedStudentIds.has(student.StudentId);

          mappedStudents.push({ ...student, hasNewWork, isExpanded });
        }

        this.checkForNewStudentSubmissions(oldStudentFiles, mappedStudents);

        this.studentFiles = mappedStudents;
        this.updateGroupHasNewWork();
        this.emitGlobalWorkStatus();
      });
  }

  private checkForNewStudentSubmissions(
    oldStudents: (StudentFilesModel & { hasNewWork?: boolean })[],
    newStudents: (StudentFilesModel & { hasNewWork?: boolean })[]
  ) {
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

        const mappedStudents: (StudentFilesModel & { hasNewWork?: boolean; isExpanded?: boolean })[] = [];

        for (let i = 0; i < res.Students.length; i++) {
          const student = res.Students[i];
          let hasNewWork = false;

          if (student.FileLabs && student.FileLabs.length > 0) {
            hasNewWork = student.FileLabs.some(file => 
              !file.IsReceived && !file.IsReturned
            );
          }

          const isExpanded = this.expandedStudentIds.has(student.StudentId);

          mappedStudents.push({ ...student, hasNewWork, isExpanded });
        }

        this.studentFiles = mappedStudents;
        this.updateGroupHasNewWork();
        this.emitGlobalWorkStatus();
      });
  }

  toggleStudentExpanded(studentId: string, isExpanded: boolean) {
    if (isExpanded) {
      this.expandedStudentIds.add(studentId);
    } else {
      this.expandedStudentIds.delete(studentId);
    }
  }

  trackByStudentId(index: number, student: StudentFilesModel & { hasNewWork?: boolean; isExpanded?: boolean }): string {
    return student.StudentId;
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
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        let hasNewWork = false;

        if (res && res.Students && res.Students.length > 0) {
          hasNewWork = res.Students.some(s => {
            if (s.FileLabs && s.FileLabs.length > 0) {
              return s.FileLabs.some(f => !f.IsReceived && !f.IsReturned);
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

        const isExpanded = this.expandedStudentIds.has(studentId);

        const updatedStudent = {
          ...this.studentFiles[index],
          FileLabs: newLabs,
          hasNewWork: hasNew,
          isExpanded: isExpanded
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

    let groupHasNew = false;

    for (let i = 0; i < this.studentFiles.length; i++) {
      const s = this.studentFiles[i];
      if (s.FileLabs && s.FileLabs.length > 0) {
        const found = s.FileLabs.some(f => !f.IsReceived && !f.IsReturned);
        if (found) {
          groupHasNew = true;
          break;
        }
      }
    }

    this.selectedGroup.hasNewWork = groupHasNew;

    for (let j = 0; j < this.groups.length; j++) {
      if (this.groups[j].GroupId === this.selectedGroup.GroupId) {
        this.groups[j].hasNewWork = groupHasNew;
        break;
      }
    }

    for (let k = 0; k < this.allGroups.length; k++) {
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
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        let hasNewWork = false;

        if (res && res.Students && res.Students.length > 0) {
          hasNewWork = res.Students.some(s => {
            if (s.FileLabs && s.FileLabs.length > 0) {
              return s.FileLabs.some(f => !f.IsReceived && !f.IsReturned);
            }
            return false;
          });
        }

        this.allGroups[i].hasNewWork = !!hasNewWork;

        for (let j = 0; j < this.groups.length; j++) {
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
    let any = false;
    for (let i = 0; i < this.allGroups.length; i++) {
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

    let attachmentId = '0';
    if (
      dialogResult &&
      dialogResult.uploadedFile &&
      dialogResult.uploadedFile.IdFile &&
      dialogResult.uploadedFile.IdFile !== -1
    ) {
      attachmentId = dialogResult.uploadedFile.IdFile;
    }

    let fileName = '';
    if (dialogResult && dialogResult.uploadedFile) {
      fileName =
        dialogResult.uploadedFile.Name ||
        (dialogResult.uploadedFile.OriginalName
          ? dialogResult.uploadedFile.OriginalName
          : dialogResult.uploadedFile.FileName || '');
    }

    let guidFileName = '';
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
      console.error(err);
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