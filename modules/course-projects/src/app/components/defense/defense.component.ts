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
import {MatDialog} from '@angular/material';
import {AddJobDialogComponent} from './add-project-dialog/add-job-dialog.component';

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
    const body = {comments: '', attachments: []};
    const dialogRef = this.dialog.open(AddJobDialogComponent, {
      width: '500px',
      data: {
        title: 'На защиту курсового проекта',
        buttonText: 'Отправить работу',
        body,
        model: 'Комментарий'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
}
