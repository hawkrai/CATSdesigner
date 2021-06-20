import {Component, Input, OnInit} from '@angular/core';
import {Percentage} from '../../models/percentage.model';
import {PercentagesService} from '../../services/percentages.service';
import {DiplomUser} from '../../models/diplom-user.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {AddStageDialogComponent} from './add-stage-dialog/add-stage-dialog.component';
import { TranslatePipe } from '../../../../../../container/src/app/pipe/translate.pipe';

@Component({
  selector: 'app-percentages',
  templateUrl: './percentages.component.html',
  styleUrls: ['./percentages.component.less']
})
export class PercentagesComponent implements OnInit {

  @Input() diplomUser: DiplomUser;

  private COUNT = 1000;
  private PAGE = 1;

  private percentages: Percentage[];

  constructor(private percentagesService: PercentagesService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              public translatePipe: TranslatePipe) {
  }

  ngOnInit() {
    this.retrievePercentages();
  }

  retrievePercentages() {
    this.percentagesService.getPercentages({
      count: this.COUNT,
      page: this.PAGE,
    })
      .subscribe(res => this.percentages = res.Items);
  }

  public getDiplomUser() {
    return this.diplomUser;
  }

  addStage() {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      autoFocus: false,
      width: '600px',
      data: {
        title: this.translatePipe.transform('text.editor.edit.addedStage',"Добавление этапа"),
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const date = new Date(result.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        this.percentagesService.editStage(null, date.toISOString(), result.name, result.percentage)
          .subscribe(() => {
            this.ngOnInit();
            this.addFlashMessage(this.translatePipe.transform('text.editor.edit.addedStage',"График успешно сохранен"));
          });
      }
    });
  }

  editStage(stage: Percentage) {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      autoFocus: false,
      width: '600px',
      data: {
        title: this.translatePipe.transform('text.editor.edit.editStage',"Редактирование этапа"),
        name: stage.Name,
        percentage: stage.Percentage,
        date: stage.Date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.name != null) {
        result.name = result.name.replace("\n","");
        var checkTheme = this.percentages.find((i) => i.Name === result.name);
        const date = new Date(result.date)
        var stageDate = new Date(stage.Date)
        if (checkTheme == undefined || stage.Percentage != result.percentage || date.toISOString() != stageDate.toISOString()) {
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          this.percentagesService.editStage(stage.Id, date.toISOString(), result.name, result.percentage)
            .subscribe(() => {
              this.ngOnInit();
              this.addFlashMessage(this.translatePipe.transform('text.editor.edit.editStageAlert',"Этап успешно изменен"));
          });
        }
        else{
          this.addFlashMessage(this.translatePipe.transform('text.editor.edit.stageExists',"Этап с такими данными уже существует"));
        } 
      }
    });
  }

  deleteStage(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '400px',
      data: {
        label: this.translatePipe.transform('text.editor.edit.removeStage',"Удаление этапа процентовки"),
        message: this.translatePipe.transform('text.editor.edit.removeStageQuestion',"Вы действительно хотите удалить этап?"),
        actionName: this.translatePipe.transform('text.editor.edit.remove',"Удалить"),
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.percentagesService.deleteStage(id).subscribe(() => {
          this.ngOnInit();
          this.addFlashMessage(this.translatePipe.transform('text.editor.edit.removeAlert',"Этап успешно удален"));
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
