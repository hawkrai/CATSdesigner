import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { ComplexGridEditPopupComponent } from '../edit-popup/edit-popup.component'
import { MapPopoverComponent } from '../map-popover/map-popover.component'
import { ComponentType } from '@angular/cdk/typings/portal'
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog'
import { DialogData } from '../../../models/DialogData'
import { ComplexService } from '../../../service/complex.service'
import { Complex } from '../../../models/Complex'
import { CatsService, CodeType } from 'src/app/service/cats.service'
import { TranslatePipe } from 'educats-translate'
import { DeleteConfirmationPopupComponent } from '../delete-confirmation-popup/delete-confirmation-popup.component'
import { StudentsMonitoringComponent } from '../students-monitoring/students-monitoring.component'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

/**
 * @title Menu with icons
 */
@Component({
  selector: 'grid-menu-icon',
  templateUrl: 'grid-menu.component.html',
  styleUrls: ['grid-menu.component.less'],
})
export class GridMenuComponent {
  @Input()
  complexId: string
  isLecturer: boolean

  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    public dialog: MatDialog,
    private complexService: ComplexService,
    private router: Router,
    private translatePipe: TranslatePipe,
    private catsService: CatsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false
    }
    this.router.onSameUrlNavigation = 'reload'

    const user = JSON.parse(localStorage.getItem('currentUser'))

    this.isLecturer = user.role === 'lector'
  }

  openEditPopup(): void {
    this.complexService.getConceptCascade(this.complexId).subscribe((res) => {
      const dialogData: DialogData = {
        buttonText: this.translatePipe.transform('common.save', 'Сохранить'),
        width: '400px',
        title: this.translatePipe.transform(
          'complex.editComplex',
          'Редактирование ЭУМК'
        ),
        isNew: false,
        name: res.Name,
        subjectName: res.SubjectName,
        isPublished: res.Published,
        includeLabs: res.IncludeLabs,
        includeLectures: res.IncludeLecturers,
        includeTests: res.IncludeTests,
      }

      const dialogRef = this.openDialog(
        dialogData,
        ComplexGridEditPopupComponent
      )

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result)
        if (!result.isNew) {
          const complex: Complex = {
            elementId: +this.complexId,
            name: result.name,
            isPublished: result.isPublished && result.isPublished === true,
          }
          this.complexService.editRootConcept(complex).subscribe((result) => {
            if (result['Code'] === '200') {
              this.router.navigateByUrl('/main')
            }
          })
        }
      })
    })
  }

  public openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationPopupComponent, {
      width: '500px',
      data: { event },
      panelClass: 'test-modal-container',
    })

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((result) => {
        if (result) {
          this.onDeleteClick()
        }
      })
  }

  onDeleteClick(): void {
    const complex: Complex = {
      elementId: +this.complexId,
    }
    this.complexService.deleteConcept(complex).subscribe((result) => {
      if (result['Code'] === '200') {
        this.catsService.showMessage({
          Message: `${this.translatePipe.transform(
            'common.success.operation',
            'Успешно удалено'
          )}.`,
          Type: CodeType.success,
        })

        this.router.navigateByUrl('/main')
      }
    })
  }

  openMonitoring(): void {
    const dialogData: DialogData = {
      id: this.complexId,
    }
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = '100%'
    dialogConfig.data = dialogData
    dialogConfig.maxWidth = 'none'

    const dialogRef = this.dialog.open(
      StudentsMonitoringComponent,
      dialogConfig
    )

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed')
    })
  }

  openMap(): void {
    const dialogData: DialogData = {
      id: this.complexId,
    }

    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = '100%'
    dialogConfig.data = dialogData
    dialogConfig.maxWidth = 'none'

    const dialogRef = this.dialog.open(MapPopoverComponent, dialogConfig)

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed')
    })
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, { data })
  }
}
