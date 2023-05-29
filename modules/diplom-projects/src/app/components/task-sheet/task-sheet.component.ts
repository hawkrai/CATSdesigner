import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '../../models/theme.model';
import { ProjectThemeService } from '../../services/project-theme.service';
import { TaskSheetService } from '../../services/task-sheet.service';
import { Subscription } from 'rxjs';
import { DiplomUser } from '../../models/diplom-user.model';
import { EditTaskSheetComponent } from './edit-task-sheet/edit-task-sheet.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Template } from 'src/app/models/template.model';
import { Student } from 'src/app/models/student.model';
import { TranslatePipe } from 'educats-translate';
import { ToastrService } from 'ngx-toastr';
import { PercentageResultsService } from 'src/app/services/percentage-results.service';

@Component({
  selector: 'app-task-sheet',
  templateUrl: './task-sheet.component.html',
  styleUrls: ['./task-sheet.component.less']
})
export class TaskSheetComponent implements OnInit {

  @Input() diplomUser: DiplomUser;

  public isEmpty = false;

  private COUNT = 1000;
  private PAGE = 1;
  private searchString = '';
  private sorting = 'Id';
  private direction = 'desc';

  private themes: Theme[];
  private taskSheetHtml: any;
  private taskSheetSubscription: Subscription;

  private diplomProjectId: number;
  private templates: any[];
  private tepmlate: Template;
  private students: Student[];

  constructor(private projectThemeService: ProjectThemeService,
    private taskSheetService: TaskSheetService,
    private percentageResultsService: PercentageResultsService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public translatePipe: TranslatePipe) {
  }

  ngOnInit() {
    this.getStudents()
    this.projectThemeService.getThemes({ entity: 'DiplomProject' })
      .subscribe(res => {
        this.themes = res;
        if (this.diplomProjectId == null && res[0]) {
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
    this.isEmpty = false;
    this.taskSheetSubscription = this.taskSheetService.getTaskSheetHtml({ diplomProjectId: this.diplomProjectId })
      .subscribe(res => {
        if (!res) {
          this.isEmpty = true;
        }
        this.taskSheetHtml = res;
        const div = document.getElementById('task-sheet');
        div.innerHTML = res;
      }, () => {
        this.isEmpty = true;
      });
  }

  getTaskSheetTemplate(taskSheet: any): object {
    var checkTheme = this.templates.find((i) => i.InputData == taskSheet.InputData
      && i.Faculty == i.Faculty
      && i.HeadCathedra == i.HeadCathedra
      && i.RpzContent == i.RpzContent
      && i.DrawMaterials == i.DrawMaterials
      && i.Univer == i.Univer
      && i.DateEnd == i.DateEnd
      && i.DateStart == i.DateStart);

    if (checkTheme != undefined) {
      this.tepmlate = new Template();
      this.tepmlate.Id = String(checkTheme.Id);
      this.tepmlate.Name = checkTheme.Name;
      return this.tepmlate;
    }
    else {
      return undefined;
    }
  }

  editTaskSheet() {
    this.taskSheetService.getTaskSheet({ diplomProjectId: this.diplomProjectId }).subscribe(response => {
      const dialogRef = this.dialog.open(EditTaskSheetComponent, {
        autoFocus: false,
        width: '548px',
        height: '750px',
        position: {
          top: "0px"
        },
        data: {
          isSecretary: this.diplomUser.IsSecretary,
          taskSheet: response,
          students: this.students,
          taskSheetTemplate: this.getTaskSheetTemplate(response),
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.taskSheetService.editTaskSheet(result).subscribe(() => {
            this.ngOnInit();
            this.toastr.success(this.translatePipe.transform('text.editor.edit.saveTaskSheet', "Лист задания успешно сохранен"));
          });
        }
        else {
          this.ngOnInit();
        }
      });
    });
  }

  getStudents() {
    if (this.diplomUser.IsLecturer) {
      this.percentageResultsService.getPercentageResults(
        'count=' + this.COUNT +
        '&page=' + this.PAGE +
        '&filter={"isSecretary":"' + true + '","searchString":"' + '' + '"}' +
        '&sorting[' + 'Id' + ']=' + 'desc'
      ).subscribe(res => { this.students = res.Students.Items.sort((a, b) => a.Name < b.Name ? -1 : 1) })
    }
  }

  retrieveTemplates() {
    this.taskSheetService.getTemplates(
      'count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter={"lecturerId":"' + this.diplomUser.UserId + '","searchString":"' + this.searchString + '"}'
    ).subscribe(res => this.templates = res.Items);
  }

  downloadTaskSheet() {
    location.href = location.origin + '/api/DpTaskSheetDownload?diplomProjectId=' + this.diplomProjectId;
  }

  downloadArchive() {
    location.href = location.origin + '/api/DpTaskSheetDownload';
  }
}
