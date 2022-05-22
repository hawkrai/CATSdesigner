import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {of, Subject, Subscription} from 'rxjs';
import {CourseUser} from '../../models/course-user.model';
import {MatDialog} from '@angular/material';
import {AddProjectDialogComponent} from './add-project-dialog/add-project-dialog.component';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {AssignProjectDialogComponent} from './assign-project-dialog/assign-project-dialog.component';
import {ProjectsService} from '../../services/projects.service';
import {Project} from '../../models/project.model';
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {AppComponent} from '../../app.component';
import {CoreGroup} from 'src/app/models/core-group.model';
import {GroupService} from '../../services/group.service';
import {ToastrService} from 'ngx-toastr';
import {CourseUserService} from '../../services/course-user.service';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  @Input() courseUser: CourseUser;

  private COUNT = 1000000;
  private PAGE = 1;

  private groups: CoreGroup[] = [];
  private projects: Project[];
  private projectsSubscription: Subscription;

  private subjectId: string;
  private searchString = '';
  private sorting = 'Id';
  private direction = 'desc';
  private readonly destroy$: Subject<void> = new Subject<void>();
  private lecturerName = '';

  constructor(private appComponent: AppComponent,
              private groupService: GroupService,
              private projectsService: ProjectsService,
              private dialog: MatDialog,
              private store: Store<IAppState>,
              private toastr: ToastrService,
              private courseService: CourseUserService) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.groupService.getGroups(this.subjectId).subscribe(res => this.groups = res.Groups);
      this.retrieveProjects();
    });

    this.courseService.getUser().pipe(switchMap((res) => {
      if (res.IsLecturer) {
        return this.courseService.getUserInfo(res.UserId);
      } else {
        return of();
      }
    }), takeUntil(this.destroy$),
    ).subscribe(res => {
      this.lecturerName = res.Name;
    });
  }

  ngOnDestroy(): void {
    if (!this.destroy$.closed) {
      this.destroy$.next();
      this.destroy$.unsubscribe();
    }
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

  chooseCourseProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '548px',
      data: {
        label: 'Выбор темы курсового проекта',
        message: 'Вы действительно хотите выбрать данную тему курсового проекта?',
        alert: 'После выбора темы ожидайте подтверждение руководителя курсового проекта. ' +
          'Затем появится возможность скачать лист задания. Если выбранная тема будет отклонена ' +
          'руководителем курсового проекта, она вновь станет доступной всем студентам.',
        actionName: 'Выбрать',
        color: 'primary',
        isConfirm: true,
        projectTheme: project.Theme
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.chooseProject(project.Id).subscribe(() => {
          this.appComponent.ngOnInit();
          this.toastr.success('Тема успешно выбрана');
        });
      }
    });
  }

  addProject() {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      autoFocus: false,
      width: '548px',
      data: {
        groups: this.groups,
        selectedGroups: this.groups.slice(),
        lecturer: this.lecturerName,
        edit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.name != null) {
        result.name = result.name.replace('\n', '');
        const checkTheme = this.projects.find((i) => i.Theme === result.name);
        if (checkTheme === undefined) {
          this.projectsService.editProject(null, this.subjectId, result.name, result.selectedGroups.map(group => group.GroupId))
            .subscribe(() => {
              this.ngOnInit();
              this.toastr.success('Тема успешно сохранена');
            });
        } else {
          this.toastr.error('Такая тема уже существует');
        }
      }
    });
  }

  editProject(project: Project) {
    this.projectsService.getProject(project.Id).subscribe(response => {
      const dialogRef = this.dialog.open(AddProjectDialogComponent, {
        autoFocus: false,
        width: '548px',
        data: {
          id: project.Id,
          name: project.Theme,
          groups: this.groups,
          lecturer: project.Lecturer,
          selectedGroups: this.groups.filter(g => response.SelectedGroupsIds.find(id => g.GroupId === id)),
          edit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.name != null) {
          result.name = result.name.replace('\n', '');
          const checkTheme = this.projects.find((i) => i.Theme === result.name && i.Id !== result.id);
          if (checkTheme === undefined) {
            this.projectsService.editProject(project.Id, this.subjectId, result.name, result.selectedGroups.map(group => group.GroupId))
              .subscribe(() => {
                this.ngOnInit();
                this.toastr.success('Тема успешно сохранена');
              });
          } else {
            this.toastr.error('Такая тема уже существует');
          }
        }
      });
    });
  }

  deleteProject(project: Project) {
    if (project.Student === null) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
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
            this.toastr.success('Тема успешно удалена');
          });
        }
      });
    } else {
      this.toastr.error('Отмените назначение темы');
    }

  }

  assignProject(project: Project) {
    this.projectsService.getStudents('count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter[courseProjectId]=' + project.Id)
      .subscribe(response => {
        const dialogRef = this.dialog.open(AssignProjectDialogComponent, {
          autoFocus: false,
          width: '548px',
          data: {
            theme: project.Theme,
            students: response.Items
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null && result) {
            this.projectsService.assignProject(project.Id, result).subscribe(() => {
              this.ngOnInit();
              this.toastr.success('Тема успешно назначена студенту');
            });
          }
        });
      });
  }

  approveChoice(project: Project) {
    this.projectsService.approveChoice(project.Id).subscribe(() => {
      this.ngOnInit();
      this.toastr.success('Тема успешно подтверждена');
    });
  }

  removeAssignment(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '548px',
      data: {
        label: 'Отменить назначение темы курсового проекта',
        message: 'Вы действительно хотите отменить назначение темы курсового проекта?',
        actionName: 'Да',
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.removeAssignment(project.Id).subscribe(() => {
          this.ngOnInit();
          this.toastr.success('Назначение успешно отменено');
        });
      }
    });
  }

  downloadTaskSheet(project: Project) {
    // const url = 'http://localhost:8080/Cp/';
    location.href = location.origin + '/api/CPTaskSheetDownload?courseProjectId=' + project.Id;
  }
}
