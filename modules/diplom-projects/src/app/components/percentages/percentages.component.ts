import { Component, Input, OnInit } from '@angular/core'
import { Percentage } from '../../models/percentage.model'
import { PercentagesService } from '../../services/percentages.service'
import { DiplomUser } from '../../models/diplom-user.model'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component'
import { AddStageDialogComponent } from './add-stage-dialog/add-stage-dialog.component'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-percentages',
  templateUrl: './percentages.component.html',
  styleUrls: ['./percentages.component.less'],
})
export class PercentagesComponent implements OnInit {
  @Input() diplomUser: DiplomUser

  public isLecturer = false
  public themes = [
    {
      name: this.translatePipe.transform(
        'text.diplomProject.head',
        'Руководитель проекта'
      ),
      value: true,
    },
    {
      name: this.translatePipe.transform(
        'text.diplomProject.secretary',
        'Секретарь ГЭК'
      ),
      value: false,
    },
  ]
  public theme = undefined

  private COUNT = 1000
  private PAGE = 1

  private percentages: Percentage[]

  constructor(
    private percentagesService: PercentagesService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    public translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    this.retrievePercentages()
    const toggleValue: string = localStorage.getItem('toggle')
    if (toggleValue && this.diplomUser.IsLecturer) {
      this.isLecturer =
        localStorage.getItem('toggle') === 'false' ? false : true
    } else {
      this.isLecturer = this.diplomUser.IsLecturer
    }
    this.theme = this.isLecturer ? this.themes[0] : this.themes[1]
  }

  retrievePercentages() {
    this.percentagesService
      .getPercentages({
        count: this.COUNT,
        page: this.PAGE,
      })
      .subscribe((res) => (this.percentages = res.Items))
  }

  lecturerStatusChange(event) {
    this.isLecturer = event.value.value
    localStorage.setItem('toggle', event.value.value)
  }

  public getDiplomUser() {
    return this.diplomUser
  }

  addStage() {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      autoFocus: false,
      height: '100%',
      width: '600px',
      data: {
        title: this.translatePipe.transform(
          'text.diplomProject.addedStage',
          'Добавление этапа процентовки'
        ),
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const date = new Date(result.date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        this.percentagesService
          .editStage(null, date.toISOString(), result.name, result.percentage)
          .subscribe(
            () => {
              this.ngOnInit()
              this.addFlashMessage(
                this.translatePipe.transform(
                  'text.diplomProject.chartSave',
                  'График успешно сохранен'
                )
              )
            },
            () =>
              this.addFlashErrorMessage(
                this.translatePipe.transform(
                  'text.diplomProject.stageExists',
                  'Этап с такими данными уже существует'
                )
              )
          )
      }
    })
  }

  editStage(stage: Percentage) {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      autoFocus: false,
      height: '100%',
      width: '600px',
      data: {
        id: stage.Id,
        title: this.translatePipe.transform(
          'text.diplomProject.editStage',
          'Редактирование этапа процентовки'
        ),
        name: stage.Name,
        percentage: stage.Percentage,
        date: stage.Date,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result.name != null) {
        result.name = result.name.replace('\n', '')
        var checkTheme = this.percentages.find((i) => i.Name === result.name)
        const date = new Date(result.date)
        var stageDate = new Date(stage.Date)
        if (
          result.Id ||
          checkTheme == undefined ||
          stage.Percentage != result.percentage ||
          date.toISOString() != stageDate.toISOString()
        ) {
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
          this.percentagesService
            .editStage(
              stage.Id,
              date.toISOString(),
              result.name,
              result.percentage
            )
            .subscribe(() => {
              this.ngOnInit()
              this.addFlashMessage(
                this.translatePipe.transform(
                  'text.diplomProject.editStageAlert',
                  'Этап успешно изменен'
                )
              )
            })
        } else {
          this.addFlashErrorMessage(
            this.translatePipe.transform(
              'text.diplomProject.stageExists',
              'Этап с такими данными уже существует'
            )
          )
        }
      }
    })
  }

  deleteStage(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '400px',
      data: {
        label: this.translatePipe.transform(
          'text.diplomProject.removeStage',
          'Удаление этапа процентовки'
        ),
        message: this.translatePipe.transform(
          'text.diplomProject.removeStageQuestion',
          'Вы действительно хотите удалить этап?'
        ),
        actionName: this.translatePipe.transform(
          'text.diplomProject.remove',
          'Удалить'
        ),
        color: 'primary',
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result) {
        this.percentagesService.deleteStage(id).subscribe(() => {
          this.ngOnInit()
          this.addFlashMessage(
            this.translatePipe.transform(
              'text.diplomProject.removeAlert',
              'Этап успешно удален'
            )
          )
        })
      }
    })
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg)
  }

  addFlashErrorMessage(msg: string) {
    this.toastr.error(msg)
  }
}
