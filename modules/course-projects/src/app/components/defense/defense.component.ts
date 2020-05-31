import {Component, Input, OnInit} from '@angular/core';
import {MatOptionSelectionChange} from '@angular/material/core';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {CourseUser} from '../../models/course-user.model';
import {UserLabFile} from '../../models/user-lab-file';
import {LabFilesService} from '../../services/lab-files-service';
import {StudentFilesModel} from '../../models/student-files.model';
import {GroupService} from '../../services/group.service';
import {CoreGroup} from '../../models/core-group.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddJobDialogComponent} from './add-project-dialog/add-job-dialog.component';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['./defense.component.less']
})
export class DefenseComponent implements OnInit {

  @Input() courseUser: CourseUser;

  public groups: CoreGroup[];
  public selectedGroup: CoreGroup;
  public studentFile: UserLabFile;
  public studentFiles: StudentFilesModel[];
  public detachedGroup = false;

  private subjectId: string;

  constructor(private groupService: GroupService,
              private labFilesService: LabFilesService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      if (this.courseUser.IsStudent) {
        this.labFilesService.getCourseProjectFilesForUser(this.subjectId, this.courseUser.UserId)
          .subscribe(res => {
            if (res.UserLabFiles) {
              this.studentFile = res.UserLabFiles[0];
            }
          });
      } else if (this.courseUser.IsLecturer) {
        this.retrieveGroupsAndFiles();
      }
    });
  }

  retrieveFiles() {
    this.studentFiles = null;
    this.labFilesService.getCourseProjectFiles({isCp: true, subjectId: this.subjectId, groupId: this.selectedGroup.GroupId})
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
    this.retrieveGroupsAndFiles();
  }

  retrieveGroupsAndFiles() {
    this.studentFiles = null;
    if (this.detachedGroup) {
      this.groupService.getDetachedGroups(this.subjectId).subscribe(res => {
        this.processGroupsResponse(res);
      });
    } else {
      this.groupService.getGroups(this.subjectId).subscribe(res => {
        this.processGroupsResponse(res);
      });
    }
  }

  processGroupsResponse(res: any) {
    this.groups = res.Groups;
    if (this.groups.length > 0) {
      this.selectedGroup = this.groups[0];
    } else {
      this.selectedGroup = null;
    }
  }

  downloadArchive() {
    const url = 'http://localhost:8080/Subject/';
    location.href = url + 'GetZipLabs?id=' + this.selectedGroup.GroupId + '&subjectId=' + this.subjectId;
  }

  addJob() {
    const body = this.studentFile ? {comments: this.studentFile.Comments, attachments: this.studentFile.Attachments}
    : {comments: '', attachments: []};
    const dialogRef = this.dialog.open(AddJobDialogComponent, {
      width: '650px',
      data: {
        title: 'На защиту курсового проекта',
        buttonText: 'Отправить работу',
        body,
        model: 'Комментарий'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const attachmentId = result.uploadedFile.IdFile && result.uploadedFile.IdFile !== -1 ? result.uploadedFile.IdFile : '0';
        this.labFilesService.sendJob({
          attachments: '[{"Id":' + attachmentId + ',"Title":"","Name":"' + result.uploadedFile.Name + '","AttachmentType":"' +
            result.uploadedFile.Type + '","FileName":"' + result.uploadedFile.GuidFileName + '"}]',
          comments: result.comments,
          id: this.studentFile ? this.studentFile.Id : '0',
          isCp: true,
          isRet: false,
          pathFile: this.studentFile ? this.studentFile.PathFile : '',
          subjectId: this.subjectId,
          userId: this.courseUser.UserId
        })
          .subscribe(() => {
            this.ngOnInit();
            this.addFlashMessage('Работа успешно добавлена');
          });
      }
    });
  }

  deleteJob() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        label: 'Удаление работы',
        message: 'Вы действительно хотите удалить работу?',
        actionName: 'Удалить',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.labFilesService.deleteJob(this.studentFile.Id)
          .subscribe(() => {
            this.ngOnInit();
            this.addFlashMessage('Работа удалена');
          });
      }
    });
  }

  addFlashMessage(msg: string) {
    this.snackBar.open(msg, null, {
      duration: 2000
    });
  }
}
