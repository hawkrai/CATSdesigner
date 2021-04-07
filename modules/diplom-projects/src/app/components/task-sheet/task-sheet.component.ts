import {Component, Input, OnInit} from '@angular/core';
import {Theme} from '../../models/theme.model';
import {ProjectThemeService} from '../../services/project-theme.service';
import {TaskSheetService} from '../../services/task-sheet.service';
import {Subscription} from 'rxjs';
import {DiplomUser} from '../../models/diplom-user.model';
import {EditTaskSheetComponent} from './edit-task-sheet/edit-task-sheet.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import { CoreGroup } from 'src/app/models/core-group.model';
import { Template } from 'src/app/models/template.model';

@Component({
  selector: 'app-task-sheet',
  templateUrl: './task-sheet.component.html',
  styleUrls: ['./task-sheet.component.less']
})
export class TaskSheetComponent implements OnInit {

  @Input() diplomUser: DiplomUser;
  @Input() groups: CoreGroup[];

  private themes: Theme[];
  private taskSheetHtml: any;
  private taskSheetSubscription: Subscription;

  private diplomProjectId: number;
  private templates: any[];
  private tepmlate: Template;

  constructor(private projectThemeService: ProjectThemeService,
              private taskSheetService: TaskSheetService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.projectThemeService.getThemes({entity: 'DiplomProject'})
        .subscribe(res => {
          this.themes = res;
          if (this.diplomProjectId == null) {
            this.diplomProjectId = res[0].Id;
          }
          this.retrieveTaskSheetHtml();
          this.retrieveTemplates();
        });
  }

  onThemeChange(themeId: number) {
    this.diplomProjectId = themeId;
    if (this.taskSheetSubscription) {
      this.taskSheetSubscription.unsubscribe();
    }
    this.retrieveTaskSheetHtml();
  }

  retrieveTaskSheetHtml() {
    this.taskSheetHtml = null;
    this.taskSheetSubscription = this.taskSheetService.getTaskSheetHtml({diplomProjectId: this.diplomProjectId})
      .subscribe(res => {
        this.taskSheetHtml = res;
        const div = document.getElementById('task-sheet');
        div.innerHTML = res;
      });
  }

  getTaskSheetTemplate(taskSheet: any): object{
    var checkTheme = this.templates.find((i) => i.InputData == taskSheet.InputData
    && i.Faculty == i.Faculty
    && i.HeadCathedra == i.HeadCathedra
    && i.RpzContent == i.RpzContent
    && i.DrawMaterials == i.DrawMaterials
    && i.Univer == i.Univer
    && i.DateEnd == i.DateEnd
    && i.DateStart == i.DateStart);

    if (checkTheme != undefined){
      this.tepmlate = new Template();
      this.tepmlate.Id = String(checkTheme.Id);
      this.tepmlate.Name = checkTheme.Name;
      return this.tepmlate;
    }
    else{
      return undefined;
    }
  }

  editTaskSheet() {
    this.taskSheetService.getTaskSheet({diplomProjectId: this.diplomProjectId}).subscribe(response => {
      const dialogRef = this.dialog.open(EditTaskSheetComponent, {
        autoFocus: false,
        width: '700px',
        height: '750px',
        position: {
          top: "0px"
        },
        data: {
          taskSheet: response,
          groups: this.groups,
          taskSheetTemplate: this.getTaskSheetTemplate(response),
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.taskSheetService.editTaskSheet(result).subscribe(() => {
            this.ngOnInit();
            this.snackBar.open('Лист задания успешно сохранен', null, {
              duration: 2000
            });
          });
        }
        else{
          this.ngOnInit();
        }
      });
    });
  }

  retrieveTemplates() {
    this.taskSheetService.getTemplates(
      'count=1000000' +
      '&page=1' +
      '&filter={"lecturerId":"' + this.diplomUser.UserId + '","searchString":"' + '' + '"}' +
      '&filter[lecturerId]=' + this.diplomUser.UserId +
      '&sorting[' + 'Id' + ']=' + 'desc'
    ).subscribe(res => this.templates = res.Items);
  }

  downloadTaskSheet() {
    location.href = location.origin + '/api/DpTaskSheetDownload?diplomProjectId=' + this.diplomProjectId;
  }
}
