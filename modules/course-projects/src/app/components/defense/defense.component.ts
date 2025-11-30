import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { MatOptionSelectionChange } from '@angular/material/core'
import { select, Store } from '@ngrx/store'
import { IAppState } from '../../store/state/app.state'
import { getSubjectId } from '../../store/selectors/subject.selector'
import { CourseUser } from '../../models/course-user.model'
import { UserLabFile } from '../../models/user-lab-file'
import { LabFilesService } from '../../services/lab-files-service'
import { StudentFilesModel } from '../../models/student-files.model'
import { GroupService } from '../../services/group.service'
import { CoreGroup } from '../../models/core-group.model'
import { MatDialog } from '@angular/material'
import { AddJobDialogComponent } from './add-project-dialog/add-job-dialog.component'
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component'
import { CheckPlagiarismStudentComponent } from './check-plagiarism-student/check-plagiarism-student.component'
import { CheckPlagiarismPopoverComponent } from '../../shared/check-plagiarism-popover/check-plagiarism-popover.component'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'
import { forkJoin } from 'rxjs'

@Component({
  selector: 'app-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['./defense.component.less'],
})
export class DefenseComponent implements OnInit {
  @Input() courseUser: CourseUser
  @Output() newWorkEvent = new EventEmitter<boolean>()

  public groups: (CoreGroup & { hasNewWork?: boolean })[] = []
  public allGroups: (CoreGroup & { hasNewWork?: boolean })[] = []
  public selectedGroup: (CoreGroup & { hasNewWork?: boolean }) | null = null

  public userLabFiles: UserLabFile[] = []
  public studentFiles: (StudentFilesModel & { hasNewWork?: boolean })[] = []
  public detachedGroup = false
  public canAddJob = false

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
      this.subjectId = subjectId

      if (this.courseUser.IsStudent) {
        this.loadStudentFiles()
      } else if (this.courseUser.IsLecturer) {
        this.retrieveGroupsAndFiles(false);
      }
    });
  }

  private loadStudentFiles() {
    this.labFilesService
      .getCourseProjectFilesForUser(this.subjectId, this.courseUser.UserId)
      .subscribe((res) => {
        if (res.UserLabFiles) {
          this.userLabFiles = res.UserLabFiles
          this.canAddJob = !this.userLabFiles.find((file) => !file.IsReturned)
        } else {
          this.canAddJob = true
        }
      })
  }

  retrieveGroupsAndFiles(groupStatusChanged: boolean) {
    const getGroups$ = this.detachedGroup
      ? this.groupService.getDetachedGroups(this.subjectId)
      : this.groupService.getGroups(this.subjectId)

    getGroups$.subscribe((res) => {
      this.groups = res.Groups.map((g) => ({ ...g, hasNewWork: false }))
      this.allGroups = [...this.groups]

      if (!this.selectedGroup || groupStatusChanged) {
        this.selectedGroup = this.groups.length > 0 ? this.groups[0] : null
      }

      this.checkAllGroupsForNewWork()

      if (this.selectedGroup) {
        this.retrieveFiles()
      }
    })
  }

  retrieveFiles() {
    if (!this.selectedGroup) return

    this.labFilesService
      .getCourseProjectFiles({
        isCp: true,
        subjectId: this.subjectId,
        groupId: this.selectedGroup.GroupId,
      })
      .subscribe((res) => {
        if (!res || !res.Students) {
          this.studentFiles = []
          this.updateGroupHasNewWork()
          return
        }

        this.studentFiles = res.Students.map((student: any) => {
          let hasNewWork = false
          if (student.FileLabs && student.FileLabs.length > 0) {
            hasNewWork = student.FileLabs.some(
              (file: any) => !file.IsReceived && !file.IsReturned
            )
          }
          return { ...student, hasNewWork }
        })

        this.updateGroupHasNewWork()
        this.emitGlobalWorkStatus()
      })
  }

  retrieveGroupsAndFiles(groupStatusChanged: boolean) {
    const getGroups$ = this.detachedGroup
      ? this.groupService.getDetachedGroups(this.subjectId)
      : this.groupService.getGroups(this.subjectId);

    getGroups$.subscribe((res) => {
      this.groups = res.Groups.map((g) => ({ ...g, hasNewWork: false }));
      this.allGroups = [...this.groups];

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

      this.studentFiles = res.Students.map((student: any) => {
        let hasNewWork = false;
        if (student.FileLabs && student.FileLabs.length > 0) {
          hasNewWork = student.FileLabs.some((file: any) => !file.IsReceived && !file.IsReturned);
        }
        return { ...student, hasNewWork };
      });

      this.updateGroupHasNewWork();
      this.emitGlobalWorkStatus();
    });
}




  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(
        (res) => res.GroupId === event.source.value
      );
      this.retrieveFiles();
    }
  }

  groupStatusChange(event) {
    this.detachedGroup = event.checked;
    this.retrieveGroupsAndFiles(true);
  }

  checkAllGroupsForNewWork() {
    if (!this.courseUser.IsLecturer || !this.groups || this.groups.length === 0)
      return

    const requests = this.groups.map((group) =>
      this.labFilesService.getCourseProjectFiles({
        isCp: true,
        subjectId: this.subjectId,
        groupId: group.GroupId,
      })
    )

    forkJoin(requests).subscribe((results) => {
      results.forEach((res, index) => {
        let hasNewWork = false
        if (res && res.Students && res.Students.length > 0) {
          hasNewWork = res.Students.some(
            (student: any) =>
              student.FileLabs &&
              student.FileLabs.some(
                (file: any) => !file.IsReceived && !file.IsReturned
              )
          )
        }
        this.groups[index].hasNewWork = hasNewWork
      })

      this.emitGlobalWorkStatus()
    })
  }

  emitGlobalWorkStatus() {
    const hasAnyNewWork = this.allGroups.some((g) => g.hasNewWork)
    this.newWorkEvent.emit(hasAnyNewWork)
  }

  updateStudentJobs(studentId: string) {
    const student = this.studentFiles.find((s) => s.StudentId === studentId)
    if (!student) return

    this.labFilesService
      .getCourseProjectFilesForUser(this.subjectId, studentId)
      .subscribe((res) => {
        student.FileLabs = res.UserLabFiles
        this.updateGroupHasNewWork()
        this.updateGlobalWorkStatusForAllGroups()
      })
  }

  updateGroupHasNewWork() {
    if (!this.selectedGroup || !this.studentFiles) return

    this.studentFiles.forEach((student) => {
      student.hasNewWork =
        student.FileLabs &&
        student.FileLabs.some((file) => !file.IsReceived && !file.IsReturned)
    })

    const groupHasNewWork = this.studentFiles.some(
      (student) => student.hasNewWork
    )

    this.selectedGroup.hasNewWork = groupHasNewWork

    const groupInList = this.groups.find(
      (g) => g.GroupId === this.selectedGroup.GroupId
    )
    if (groupInList) groupInList.hasNewWork = groupHasNewWork

    const groupInAll = this.allGroups.find(
      (g) => g.GroupId === this.selectedGroup.GroupId
    )
    if (groupInAll) groupInAll.hasNewWork = groupHasNewWork

    this.emitGlobalWorkStatus()
  }

  updateGlobalWorkStatusForAllGroups() {
    if (!this.allGroups || this.allGroups.length === 0) return

    const requests = this.allGroups.map((group) =>
      this.labFilesService.getCourseProjectFiles({
        isCp: true,
        subjectId: this.subjectId,
        groupId: group.GroupId,
      })
    )

    forkJoin(requests).subscribe((results) => {
      results.forEach((res, index) => {
        let hasNewWork = false
        if (res && res.Students && res.Students.length > 0) {
          hasNewWork = res.Students.some(
            (student: any) =>
              student.FileLabs &&
              student.FileLabs.some((f: any) => !f.IsReceived && !f.IsReturned)
          )
        }

        this.allGroups[index].hasNewWork = hasNewWork

        const groupInCurrent = this.groups.find(
          (g) => g.GroupId === this.allGroups[index].GroupId
        )
        if (groupInCurrent) groupInCurrent.hasNewWork = hasNewWork
      })

      this.emitGlobalWorkStatus()
    })
  }

  approveJob(fileLab: UserLabFile, studentId: string) {
    this.labFilesService.approveJob(fileLab.Id).subscribe(() => {
      fileLab.IsReceived = true
      this.updateStudentJobs(studentId)
      this.updateGroupHasNewWork()
    })
  }

  restoreFromArchive(fileLab: UserLabFile, studentId: string) {
    this.labFilesService.restoreFromArchive(fileLab.Id).subscribe(() => {
      fileLab.IsReceived = false
      this.updateStudentJobs(studentId)
      this.updateGroupHasNewWork()
    })
  }

  downloadArchive() {
    if (!this.selectedGroup) return
    const url = 'http://localhost:8080/Subject/'
    location.href = `${url}GetZipLabs?id=${this.selectedGroup.GroupId}&subjectId=${this.subjectId}`
  }

  addJob(userLabFile?: UserLabFile, studentId?: string) {
    const body =
      userLabFile && this.courseUser.IsStudent
        ? {
            comments: userLabFile.Comments,
            attachments: userLabFile.Attachments,
          }
        : { comments: '', attachments: [] }

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
        const isLecturer = this.courseUser.IsLecturer
        const id = !userLabFile || isLecturer ? '0' : userLabFile.Id
        const attachmentId =
          result.uploadedFile &&
          result.uploadedFile.IdFile &&
          result.uploadedFile.IdFile !== -1
            ? result.uploadedFile.IdFile
            : '0'

        this.labFilesService
          .sendJob({
            attachments: `[{"Id":${attachmentId},"Title":"","Name":"${result.uploadedFile.Name}","AttachmentType":"${result.uploadedFile.Type}","FileName":"${result.uploadedFile.GuidFileName}"}]`,
            comments: result.comments,
            id,
            isCp: true,
            isRet: isLecturer,
            pathFile: userLabFile ? userLabFile.PathFile : '',
            subjectId: this.subjectId,
            userId: studentId,
          })
          .subscribe(() => {
            if (isLecturer) this.updateStudentJobs(studentId)
            else this.ngOnInit()
            this.canAddJob = false
          })
      }
    })
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
          this.ngOnInit()
        })
      }
    })
  }

  checkPlagiarism() {
    this.dialog.open(CheckPlagiarismPopoverComponent, {
      data: { body: this.subjectId },
    })
  }

  checkPlagiarismFile(file) {
    this.dialog.open(CheckPlagiarismStudentComponent, {
      data: { body: { subjectId: this.subjectId, userFileId: file.Id } },
    })
  }
}
