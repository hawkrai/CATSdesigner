import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CourseUser} from '../../models/course-user.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddProjectDialogComponent} from './add-project-dialog/add-project-dialog.component';
import {Group} from '../../models/group.model';
import {ProjectGroupService} from '../../services/project-group.service';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {AssignProjectDialogComponent} from './assign-project-dialog/assign-project-dialog.component';
import {ProjectsService} from '../../services/projects.service';
import {Project} from '../../models/project.model';
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {

  @Input() courseUser: CourseUser;

  private COUNT = 1000000;
  private PAGE = 1;

  private groups: Group[];
  private projects: Project[];
  private projectsSubscription: Subscription;

  private subjectId: string;
  private searchString = '';
  private sorting = 'Id';
  private direction = 'desc';

  constructor(private appComponent: AppComponent,
              private projectGroupService: ProjectGroupService,
              private projectsService: ProjectsService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.projectGroupService.getGroups(this.subjectId).subscribe(res => this.groups = res);
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '540px',
      data: {
        label: 'Выбор темы курсового проекта',
        message: 'Вы действительно хотите выбрать данную тему курсового проекта?',
        actionName: 'Выбрать',
        color: 'accent'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.chooseProject(projectId).subscribe(() => {
          this.appComponent.ngOnInit();
          this.addFlashMessage('Тема успешно выбрана');
        });
      }
    });
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
          .subscribe(() => {
            this.ngOnInit();
            this.addFlashMessage('Тема успешно сохранена');
          });
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
          selectedGroups: this.groups.filter(g => response.SelectedGroupsIds.find(id => g.Id === id)),
          edit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.projectsService.editProject(project.Id, this.subjectId, result.name, result.selectedGroups.map(group => group.Id))
            .subscribe(() => {
              this.ngOnInit();
              this.addFlashMessage('Тема успешно сохранена');
            });
        }
      });
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        label: 'Удаление темы курсового проекта',
        message: 'Вы действительно хотите удалить тему курсового проекта?',
        actionName: 'Удалить',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.deleteProject(project.Id).subscribe(() => {
          this.ngOnInit();
          this.addFlashMessage('Тема успешно удалена');
        });
      }
    });
  }

  assignProject(project: Project) {
    this.projectsService.getStudents('count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter[courseProjectId]=' + project.Id)
      .subscribe(response => {
        const dialogRef = this.dialog.open(AssignProjectDialogComponent, {
          width: '720px',
          data: {
            students: response.Items
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null && result) {
            this.projectsService.assignProject(project.Id, result).subscribe(() => {
              this.ngOnInit();
              this.addFlashMessage('Тема успешно назначена студенту');
            });
          }
        });
      });
  }

  approveChoice(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '540px',
      data: {
        label: 'Подтверждение выбора темы курсового проекта',
        message: 'Вы действительно хотите подтвердить выбор данной темы курсового проекта?',
        actionName: 'Подтвердить',
        color: 'accent'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.approveChoice(project.Id).subscribe(() => {
          this.ngOnInit();
          this.addFlashMessage('Тема успешно подтверждена');
        });
      }
    });
  }

  removeAssignment(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '540px',
      data: {
        label: 'Отменить назначение курсового проекта',
        message: 'Вы действительно хотите отменить назначение курсового проекта?',
        actionName: 'Убрать назначение',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.removeAssignment(project.Id).subscribe(() => {
          this.ngOnInit();
          this.addFlashMessage('Назначение успешно отменено');
        });
      }
    });
  }

  downloadTaskSheet(project: Project) {
    const url = 'http://localhost:8080/Cp/';
    location.href = url + 'GetTasksSheetDocument?courseProjectId=' + project.Id;
  }

  addFlashMessage(msg: string) {
    this.snackBar.open(msg, null, {
      duration: 2000
    });
  }

}
