import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { IAppState } from '../store/states/app.state'
import { getSubjectId } from '../store/selectors/subject.selector'
import { Router, NavigationExtras } from '@angular/router'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ComponentType } from '@angular/cdk/typings/portal'
import { ComplexGridEditPopupComponent } from './components/edit-popup/edit-popup.component'
import { ComplexRulesPopoverComponent } from './components/complex-rules-popover/complex-rules-popover.component'
import { ComplexService } from '../service/complex.service'
import { DialogData } from '../models/DialogData'
import { Complex } from '../models/Complex'
import { TranslatePipe } from 'educats-translate'
import { CatsService, CodeType } from '../service/cats.service'
import { StorageKeys } from '../../../../../container/src/app/core/models/storage-keys.enum'

@Component({
  selector: 'complex-grid',
  templateUrl: './complexGrid.component.html',
  styleUrls: ['./complexGrid.component.less'],
})
export class ComplexGridComponent implements OnInit {
  complexes
  subjectName
  subjectId

  isLecturer: boolean
  showLoader: boolean
  breakpoint: number

  constructor(
    public dialog: MatDialog,
    private complexService: ComplexService,
    private store: Store<IAppState>,
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

    this.showLoader = false
  }

  ngOnInit(): void {
    this.breakpoint =
      window.innerWidth <= 530
        ? 1
        : window.innerWidth <= 750
          ? 2
          : window.innerWidth <= 1060
            ? 3
            : 4
    this.store.pipe(select(getSubjectId)).subscribe((subjectId) => {
      this.subjectId = subjectId
      this.complexService.getRootConcepts(this.subjectId).subscribe((res) => {
        this.complexes = res
        this.checkAndNavigateToSelectedComplex()
      })
      this.complexService
        .getRootConceptsSubjectName(this.subjectId)
        .subscribe((res) => {
          this.subjectName = res
        })
    })
  }

  private checkAndNavigateToSelectedComplex(): void {
    const selectedComplexId = localStorage.getItem(StorageKeys.SelectedComplex)
    if (selectedComplexId && this.complexes) {
      const complexExists = this.complexes.some(
        (c: any) => c.id === selectedComplexId || c.id === +selectedComplexId
      )
      if (complexExists) {
        const navigationExtras: NavigationExtras = {
          state: selectedComplexId as any,
        }
        localStorage.removeItem(StorageKeys.SelectedComplex)
        this.router.navigate(['/cMaterial'], navigationExtras)
      }
    }
  }
  onResize(event) {
    this.breakpoint =
      event.target.innerWidth <= 530
        ? 1
        : event.target.innerWidth <= 750
          ? 2
          : event.target.innerWidth <= 1060
            ? 3
            : 4
  }

  adjustNameLength(componentName: string): string {
    if (componentName.length <= 9) {
      return componentName
    }

    return `${componentName.substring(0, 8)}...`
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, { data })
  }

  openPDF() {
    const dialogRef = this.dialog.open(ComplexRulesPopoverComponent, {
      width: '1000px',
      data: { name: 'name' },
      autoFocus: false,
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed')
    })
  }

  onAddButtonClick() {
    this.complexService.getAvailableModules().subscribe((availableModules) => {
      const dialogData: DialogData = {
        buttonText: this.translatePipe.transform('common.save', 'Сохранить'),
        width: '500px',
        title: this.translatePipe.transform(
          'complex.addComplex',
          'Добавление ЭУМК'
        ),
        name: '',
        subjectName: this.subjectName,
        isNew: true,
        // @ts-ignore
        availableModules,
      }

      const dialogRef = this.openDialog(
        dialogData,
        ComplexGridEditPopupComponent
      )

      dialogRef.afterClosed().subscribe((result) => {
        const {
          name,
          isPublished,
          includeLabs,
          includeWorkshops,
          includeLectures,
          includeTests,
        } = result

        const complex: Complex = {
          name,
          container: '',
          subjectId: this.subjectId,
          isPublished,
          includeLabs,
          includeLectures,
          includeWorkshops,
          includeTests,
        }
        this.showLoader = true
        this.complexService.addRootConcept(complex).subscribe((result) => {
          if (result['Code'] === '500') {
            this.showLoader = false
            this.router.navigateByUrl('/main')
            this.catsService.showMessage({
              Message: `${this.translatePipe.transform(
                'common.error.operation',
                'Эумк с таким именем уже существует'
              )}.`,
              Type: CodeType.error,
            })
          } else {
            this.showLoader = false
            this.router.navigateByUrl('/main')
            this.catsService.showMessage({
              Message: `${this.translatePipe.transform(
                'common.success.operation',
                'Успешно сохранено'
              )}.`,
              Type: CodeType.success,
            })
          }
        })
      })
    })
  }
}
