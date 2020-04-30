import {Component, OnInit} from '@angular/core';
import {ProjectsService} from 'src/app/services/projects.service';
import {ActivatedRoute} from '@angular/router';
import {Project} from 'src/app/models/project.model';
import {Subscription} from 'rxjs';
import {CourseUserService} from '../../services/course-user.service';
import {CourseUser} from '../../models/course-user.model';
import {MatDialog} from '@angular/material';
import {AddProjectDialogComponent} from './add-project-dialog/add-project-dialog.component';
import {Group} from '../../models/group.model';
import {ProjectGroupService} from '../../services/project-group.service';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {AssignProjectDialogComponent} from './assign-project-dialog/assign-project-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {

  private COUNT = 1000000;
  private PAGE = 1;

  private groups: Group[];
  private projects: Project[];
  private projectsSubscription: Subscription;

  private courseUser: CourseUser;
  private subjectId: string;
  private searchString = '';
  private sorting = 'Id';
  private direction = 'desc';

  constructor(private projectGroupService: ProjectGroupService,
              private projectsService: ProjectsService,
              private courseUserService: CourseUserService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;
    this.projectGroupService.getGroups(this.subjectId).subscribe(res => this.groups = res);
    this.courseUserService.getUser().subscribe(res => {
      this.courseUser = res;
      this.retrieveProjects();
    });
  }

  retrieveProjects() {
    this.projectsSubscription = this.projectsService.getProjects(
      'count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter={"subjectId":"' + this.subjectId + '","searchString":"' + this.searchString + '"}' +
      '&filter[subjectId]=' + this.subjectId +
      '&sorting[' + this.sorting + ']=' + this.direction
    )
      .subscribe(res => this.projects = res.Items);
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText;
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    this.retrieveProjects();
  }

  sort(field: string, direction: string) {
    if (!direction) {
      this.sorting = 'Id';
      this.direction = 'desc';
    } else {
      this.sorting = field;
      this.direction = direction;
    }
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    this.retrieveProjects();
  }

  chooseCourseProject(projectId: string) {
    this.projectsService.chooseProject(projectId).subscribe(() => this.ngOnInit());
  }

  addProject() {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '700px',
      data: {
        groups: this.groups,
        selectedGroups: this.groups
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.projectsService.editProject(null, this.subjectId, result.name, result.selectedGroups.map(group => group.Id))
            .subscribe(res => this.ngOnInit());
      }
    });
  }

  editProject(project: Project) {
    this.projectsService.getProject(project.Id).subscribe(response => {
      const dialogRef = this.dialog.open(AddProjectDialogComponent, {
        width: '700px',
        data: {
          name: project.Theme,
          groups: this.groups,
          selectedGroups: this.groups.filter(g => response.SelectedGroupsIds.find(id => g.Id === id))
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.projectsService.editProject(project.Id, this.subjectId, result.name, result.selectedGroups.map(group => group.Id))
              .subscribe(res => this.ngOnInit());
        }
      });
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        label: 'Удаление темы курсового проекта (работы)',
        message: 'Вы действительно хотите удалить тему курсового проекта (работы)?',
        actionName: 'Удалить'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.deleteProject(project.Id).subscribe(res => this.ngOnInit());
      }
    });
  }

  assignProject(project: Project) {
    this.projectsService.getStudents('count=' + this.COUNT +
        '&page=' + this.PAGE +
        '&filter[courseProjectId]=' + project.Id)
        .subscribe(response => {
      const dialogRef = this.dialog.open(AssignProjectDialogComponent, {
        width: '620px',
        data: {
          students: response.Items
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result) {
          this.projectsService.assignProject(project.Id, result).subscribe(res => this.ngOnInit());
        }
      });
    });
  }

  removeAssignment(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '540px',
      data: {
        label: 'Отменить назначение курсового проекта (работы)',
        message: 'Вы действительно хотите отменить назначение курсового проекта (работы)?',
        actionName: 'Убрать назначение'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.removeAssignment(project.Id).subscribe(res => this.ngOnInit());
      }
    });
  }

}
