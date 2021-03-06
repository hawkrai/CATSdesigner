import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CourseUser} from '../../models/course-user.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddProjectDialogComponent} from './add-project-dialog/add-project-dialog.component';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {AssignProjectDialogComponent} from './assign-project-dialog/assign-project-dialog.component';
import {ProjectsService} from '../../services/projects.service';
import {Project} from '../../models/project.model';
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {AppComponent} from '../../app.component';
import { CoreGroup } from 'src/app/models/core-group.model';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {

  @Input() courseUser: CourseUser;

  private COUNT = 1000000;
  private PAGE = 1;

  private groups: CoreGroup[];
  private projects: Project[];
  private projectsSubscription: Subscription;

  private subjectId: string;
  private searchString = '';
  private sorting = 'Id';
  private direction = 'desc';

  constructor(private appComponent: AppComponent,
              private groupService: GroupService,
              private projectsService: ProjectsService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.groupService.getGroups(this.subjectId).subscribe(res => this.groups = res.Groups);
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
        color: 'primary'
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
      width: '500px',
      data: {
        groups: this.groups,
        selectedGroups: this.groups.slice()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.name != null) {
        result.name = result.name.replace("\n","");
        var checkTheme = this.projects.find((i) => i.Theme === result.name);
        if (checkTheme == undefined){
          this.projectsService.editProject(null, this.subjectId, result.name, result.selectedGroups.map(group => group.GroupId))
          .subscribe(() => {
            this.ngOnInit();
            this.addFlashMessage('Тема успешно сохранена');
          });
        }
        else{
          this.addFlashMessage('Такая тема уже существует');
        } 
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
          selectedGroups: this.groups.filter(g => response.SelectedGroupsIds.find(id => g.GroupId === id)),
          edit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.name != null) {
          result.name = result.name.replace("\n","");
          var checkTheme = this.projects.find((i) => i.Theme === result.name);
          if (checkTheme == undefined){
            this.projectsService.editProject(project.Id, this.subjectId, result.name, result.selectedGroups.map(group => group.GroupId))
            .subscribe(() => {
              this.ngOnInit();
              this.addFlashMessage('Тема успешно сохранена');
            });
          }
          else{
            this.addFlashMessage('Такая тема уже существует');
          }
        }
      });
    });
  }

  deleteProject(project: Project) {
    if(project.Student === null){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: {
          label: 'Удаление темы курсового проекта',
          message: 'Вы действительно хотите удалить тему курсового проекта?',
          actionName: 'Удалить',
          color: 'primary'
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
    else{
      this.addFlashMessage('Отмените назначение темы');
    }
    
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
    this.projectsService.approveChoice(project.Id).subscribe(() => {
      this.ngOnInit();
      this.addFlashMessage('Тема успешно подтверждена');
    });
  }

  removeAssignment(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '540px',
      data: {
        label: 'Отменить назначение темы курсового проекта',
        message: 'Вы действительно хотите отменить назначение темы курсового проекта?',
        actionName: 'Отменить назначение',
        color: 'primary'
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
    //const url = 'http://localhost:8080/Cp/';
    location.href = location.origin + '/api/CPTaskSheetDownload?courseProjectId=' + project.Id;
  }

  addFlashMessage(msg: string) {
    this.snackBar.open(msg, null, {
      duration: 2000
    });
  }

}
