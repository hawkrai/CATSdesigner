import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiplomUser } from '../../models/diplom-user.model';
import { MatDialog, MatOptionSelectionChange, MatSnackBar } from '@angular/material';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AssignProjectDialogComponent } from './assign-project-dialog/assign-project-dialog.component';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';
import { AppComponent } from '../../app.component';
import { CoreGroup } from 'src/app/models/core-group.model';
import { GroupService } from '../../services/group.service';
import { TranslatePipe } from 'educats-translate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {

  @Input() diplomUser: DiplomUser;

  private COUNT = 1000000;
  private PAGE = 1;

  private groups: CoreGroup[];
  private projects: Project[];
  private projectsSubscription: Subscription;
  private projectGroups: String[];
  private filteredProjects: Project[] = [];
  public isLecturer = false;
  public themes = [{ name: this.translatePipe.transform('text.diplomProject.head', "Руководитель проекта"), value: true }, { name: this.translatePipe.transform('text.diplomProject.secretary', "Секретарь ГЭК"), value: false }];
  public theme = undefined;
  

  public toggleNameForTranslate: string = 'text.diplomProject.head';
  public toggleNameTranslate: string = 'Руководитель проекта';

  private searchString = '';
  private sorting = 'Id';
  private direction = 'desc';

  constructor(private appComponent: AppComponent,
    private groupService: GroupService,
    private projectsService: ProjectsService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public translatePipe: TranslatePipe) {
  }

  ngOnInit() {
    this.isLecturer = (localStorage.getItem('toggle') === 'false' ? false : true);
    this.theme = this.isLecturer ? this.themes[0] : this.themes[1]
    this.groupService.getGroupsByUser(this.diplomUser.UserId).subscribe(res => { res.isLecturer ? this.isLecturer = true : this.isLecturer = false; this.groups = res.Groups });
    this.retrieveProjects();
  }

  retrieveProjects() {
    this.projectsSubscription = this.projectsService.getProjects(
      'count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter={"isSecretary":"' + !this.isLecturer + '","searchString":"' + this.searchString + '"}' +
      '&sorting[' + this.sorting + ']=' + this.direction
    )
      .subscribe(res => {
        this.projects = res.Items;
        this.projectGroups = this.projects.map(a => a.Group).filter((v, i, a) => a.indexOf(v) === i);
        this.filteredProjects = this.projects;
      });
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText;
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    this.retrieveProjects();
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    console.log(event)
    if (event.isUserInput) {
      this.filteredProjects = this.projects.filter(x => x.Group == event.source.value)
    }
  }

  lecturerStatusChange(event) {
    this.isLecturer = event.value.value;
    localStorage.setItem('toggle', event.value.value);
    this.retrieveProjects()
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

  chooseDiplomProject(projectId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '540px',
      data: {
        label: this.translatePipe.transform('text.editor.edit.chooseTheme', "Выбор темы дипломного проекта"),
        message: this.translatePipe.transform('text.editor.edit.check', "Вы действительно хотите выбрать данную тему дипломного проекта?"),
        actionName: this.translatePipe.transform('text.editor.edit.choose', "Выбрать"),
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.chooseProject(projectId).subscribe(() => {
          this.appComponent.ngOnInit();
          this.addFlashMessageSuccess(this.translatePipe.transform('text.editor.edit.response', "Тема успешно выбрана"));
        });
      }
    });
  }

  addProject() {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      autoFocus: false,
      width: '500px',
      height: '100%',
      position: { top: '0%' },
      data: {
        groups: this.groups,
        selectedGroups: this.groups.slice()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.name != null) {
        var checkTheme = this.projects.find((i) => i.Theme === result.name);
        if (checkTheme == undefined) {
          this.projectsService.editProject(null, result.name, result.selectedGroups.map(group => group.GroupId))
            .subscribe(() => {
              this.ngOnInit();
              this.addFlashMessageSuccess(this.translatePipe.transform('text.editor.edit.responseSave', "Тема успешно сохранена"));
            }, () => this.addFlashMessageError(this.translatePipe.transform('text.editor.edit.responseError', "Такая тема уже существует")));
        }
        else {
          this.addFlashMessageError(this.translatePipe.transform('text.editor.edit.responseError', "Такая тема уже существует"));
        }
      }
    });
  }

  editProject(project: Project) {
    this.projectsService.getProject(project.Id).subscribe(response => {
      const dialogRef = this.dialog.open(AddProjectDialogComponent, {
        autoFocus: false,
        width: '500px',
        height: '100%',
        position: { top: '0%' },
        data: {
          name: project.Theme,
          groups: this.groups,
          selectedGroups: this.groups.filter(g => response.SelectedGroupsIds.find(id => g.GroupId === id)),
          edit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.projectsService.editProject(project.Id, result.name, result.selectedGroups.map(group => group.GroupId))
            .subscribe(() => {
              this.ngOnInit();
              this.addFlashMessageSuccess(this.translatePipe.transform('text.editor.edit.responseSave', "Тема успешно сохранена"));
            });
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
          label: this.translatePipe.transform('text.diplomProject.removeTheme', "Удаление темы дипломного проекта"),
          message: this.translatePipe.transform('text.diplomProject.removeThemeQuestion', "Вы действительно хотите удалить тему дипломного проекта?"),
          actionName: this.translatePipe.transform('text.diplomProject.removeButton', "Удалить"),
          color: 'primary'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result) {
          this.projectsService.deleteProject(project.Id).subscribe(() => {
            this.ngOnInit();
            this.addFlashMessageSuccess(this.translatePipe.transform('text.editor.edit.responseDelete', "Тема успешно удалена"));
          });
        }
      });
    }
    else {
      this.addFlashMessageError(this.translatePipe.transform('text.editor.edit.cancelTheme', "Отмените назначение темы"));
    }

  }

  assignProject(project: Project) {
    this.projectsService.getStudents('count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter[diplomProjectId]=' + project.Id)
      .subscribe(response => {
        const dialogRef = this.dialog.open(AssignProjectDialogComponent, {
          autoFocus: false,
          width: '600px',
          height: '100%',
          position: { top: '0%' },
          data: {
            students: response.Items
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != null && result) {
            this.projectsService.assignProject(project.Id, result).subscribe(() => {
              this.ngOnInit();
              this.addFlashMessageSuccess(this.translatePipe.transform('text.editor.edit.assignThemeForStudent', "Тема успешно назначена студенту"));
            });
          }
        });
      });
  }

  approveChoice(project: Project) {
    this.projectsService.approveChoice(project.Id).subscribe(() => {
      this.ngOnInit();
      this.addFlashMessageSuccess(this.translatePipe.transform('text.editor.edit.responseAssign', "Тема успешно подтверждена"));
    });
  }

  removeAssignment(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '540px',
      data: {
        label: this.translatePipe.transform('text.diplomProject.cancelAssignTheme', "Отменить назначение темы дипломного проекта"),
        message: this.translatePipe.transform('text.diplomProject.cancelAssignQuestion', "Вы действительно хотите отменить назначение темы дипломного проекта?"),
        actionName: this.translatePipe.transform('text.diplomProject.removeAssign', "Убрать назначение"),
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.projectsService.removeAssignment(project.Id).subscribe(() => {
          this.ngOnInit();
          this.addFlashMessageSuccess(this.translatePipe.transform('text.editor.edit.responseRemove', "Назначение успешно отменено"));
        });
      }
    });
  }

  downloadTaskSheet(project: Project) {
    location.href = location.origin + '/api/DpTaskSheetDownload?diplomProjectId=' + project.Id;
  }

  addFlashMessageSuccess(msg: string) {
    this.toastr.success(msg);
  }

  addFlashMessageError(msg: string) {
    this.toastr.error(msg);
  }

}
