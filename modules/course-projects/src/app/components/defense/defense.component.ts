import {Component, OnInit} from '@angular/core';
import {Group} from '../../models/group.model';
import {MatOptionSelectionChange} from '@angular/material/core';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {ProjectGroupService} from '../../services/project-group.service';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {CourseUser} from '../../models/course-user.model';
import {CourseUserService} from '../../services/course-user.service';
import {UserLabFile} from '../../models/user-lab-file';
import {LabFilesService} from '../../services/lab-files-service';
import {StudentFilesModel} from '../../models/student-files.model';

@Component({
  selector: 'app-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['./defense.component.less']
})
export class DefenseComponent implements OnInit {

  public courseUser: CourseUser;
  public groups: Group[];
  public selectedGroup: Group;
  public studentFile: UserLabFile;
  public studentFiles: StudentFilesModel[];

  private subjectId: string;

  constructor(private courseUserService: CourseUserService,
              private projectGroupService: ProjectGroupService,
              private labFilesService: LabFilesService,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      this.courseUserService.getUser().subscribe(user => {
        this.courseUser = user;
        if (this.courseUser.IsStudent) {
          this.labFilesService.getCourseProjectFilesForUser(
            {isCoursPrj: true, subjectId: this.subjectId, userId: this.courseUser.UserId})
            .subscribe(res => {
              if (res.UserLabFiles) {
                this.studentFile = res.UserLabFiles[0];
              }
            });
        } else if (this.courseUser.IsLecturer) {
          this.projectGroupService.getGroups(this.subjectId).subscribe(groups => {
            this.groups = groups;
            this.selectedGroup = groups[0];
            this.retrieveFiles();
          });
        }
      });
    });
  }

  retrieveFiles() {
    this.labFilesService.getCourseProjectFiles({isCp: true, subjectId: this.subjectId, groupId: this.selectedGroup.Id})
      .subscribe(res => this.studentFiles = res.Students);
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.Id === event.source.value);
      this.retrieveFiles();
    }
  }

}
