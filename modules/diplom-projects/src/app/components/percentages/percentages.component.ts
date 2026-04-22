import { Component, Input, OnInit } from '@angular/core'
import { Percentage } from '../../models/percentage.model'
import { PercentagesService } from '../../services/percentages.service'
import { DiplomUser } from '../../models/diplom-user.model'
import { MatDialog } from '@angular/material'
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component'
import { AddStageDialogComponent } from './add-stage-dialog/add-stage-dialog.component'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'
import { GroupService } from 'src/app/services/group.service'

@Component({
  selector: 'app-percentages',
  templateUrl: './percentages.component.html',
  styleUrls: ['./percentages.component.less'],
})
export class PercentagesComponent implements OnInit {
  @Input() diplomUser: DiplomUser

  public isLecturer = false
  public selectedGroupId: number = null
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

  public groups: { id: number; name: string }[] = []
  public selectedGroup: { id: number; name: string } = null

  private COUNT = 1000
  private PAGE = 1

  public percentages: Percentage[]

  constructor(
    private percentagesService: PercentagesService,
    private groupService: GroupService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    public translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    const toggleValue: string = localStorage.getItem('toggle')
    if (
      toggleValue &&
      this.diplomUser.IsLecturer &&
      this.diplomUser.IsSecretary
    ) {
      this.isLecturer = toggleValue === 'false' ? false : true
    } else if (
      this.diplomUser.IsSecretary &&
      !this.diplomUser.IsLecturerHasGraduateStudents
    ) {
      this.isLecturer = false
    } else {
      this.isLecturer = this.diplomUser.IsLecturer
    }
    this.theme = this.isLecturer ? this.themes[0] : this.themes[1]

    if (
      this.isLecturer &&
      this.diplomUser.LecturerGroupIds &&
      this.diplomUser.LecturerGroupIds.length > 0
    ) {
      this.loadGroups()
    } else {
      this.retrievePercentages()
    }
  }

  loadGroups() {
    this.groupService
      .getGroupsByUser(String(this.diplomUser.UserId))
      .subscribe((res: any) => {
        const list = res.Groups || []

        const allGroups: { id: number; name: string }[] = list
          .filter((g: any) =>
            this.diplomUser.LecturerGroupIds.includes(g.GroupId)
          )
          .map((g: any) => ({ id: g.GroupId, name: g.GroupName.trim() }))
          .sort((a, b) => (a.name < b.name ? -1 : 1))

        this.groups = allGroups

        if (this.groups.length > 0 && !this.selectedGroup) {
          this.selectedGroup = this.groups[0]
          this.selectedGroupId = this.groups[0].id
        }

        this.retrievePercentages()
      })
  }

  retrievePercentages() {
    const params: any = {
      count: this.COUNT,
      page: this.PAGE,
    }

    this.percentagesService.getPercentages(params).subscribe((res) => {
      if (this.isLecturer) {
        if (this.selectedGroupId) {
          this.percentages = res.Items.filter(
            (item: any) =>
              item.SelectedGroupsIds &&
              item.SelectedGroupsIds.includes(this.selectedGroupId)
          )
        } else {
          this.percentages = res.Items
        }
      } else {
        this.percentages = res.Items.filter(
          (item: any) =>
            item.SelectedGroupsIds &&
            item.SelectedGroupsIds.some((gId: number) =>
              this.diplomUser.SelectedGroupIds.includes(gId)
            )
        )
      }
    })
  }

  onGroupChange(group: { id: number; name: string }) {
    this.selectedGroup = group
    this.selectedGroupId = group.id
    this.retrievePercentages()
  }

  compareGroups(
    a: { id: number; name: string },
    b: { id: number; name: string }
  ): boolean {
    return a && b ? a.id === b.id : a === b
  }

  lecturerStatusChange(event) {
    this.isLecturer = event.value.value
    this.selectedGroup = null
    this.selectedGroupId = null
    this.groups = []
    localStorage.setItem('toggle', event.value.value)
    if (
      this.isLecturer &&
      this.diplomUser.LecturerGroupIds &&
      this.diplomUser.LecturerGroupIds.length > 0
    ) {
      this.loadGroups()
    } else {
      this.retrievePercentages()
    }
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
        selectedGroupsIds: this.diplomUser.SelectedGroupIds,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const date = new Date(result.date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        this.percentagesService
          .editStage(
            null,
            date.toISOString(),
            result.name,
            result.percentage,
            result.selectedGroupsIds
          )
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
              result.percentage,
              result.selectedGroupsIds
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
      width: '600px',
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
