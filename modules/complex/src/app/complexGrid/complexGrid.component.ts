import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { IAppState } from '../store/states/app.state'
import { getSubjectId } from '../store/selectors/subject.selector'
import { Router } from '@angular/router'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ComponentType } from '@angular/cdk/typings/portal'
import { ComplexGridEditPopupComponent } from './components/edit-popup/edit-popup.component'
import { ComplexRulesPopoverComponent } from './components/complex-rules-popover/complex-rules-popover.component'
import { ComplexService } from '../service/complex.service'
import { DialogData } from '../models/DialogData'
import { Complex } from '../models/Complex'
import { TranslatePipe } from 'educats-translate'

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

  constructor(
    public dialog: MatDialog,
    private complexService: ComplexService,
    private store: Store<IAppState>,
    private router: Router,
    private translatePipe: TranslatePipe
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
    this.store.pipe(select(getSubjectId)).subscribe((subjectId) => {
      this.subjectId = subjectId
      this.complexService.getRootConcepts(this.subjectId).subscribe((res) => {
        this.complexes = res
      })
      this.complexService
        .getRootConceptsSubjectName(this.subjectId)
        .subscribe((res) => {
          this.subjectName = res
        })
    })
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
      width: '800px',
      data: { name: 'name' },
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed')
    })
  }

  onAddButtonClick() {
    const dialogData: DialogData = {
      buttonText: this.translatePipe.transform('common.save', 'Сохранить'),
      width: '400px',
      title: this.translatePipe.transform(
        'complex.addComplex',
        'Добавление ЭУМК'
      ),
      name: '',
      subjectName: this.subjectName,
      isNew: true,
    }

    const dialogRef = this.openDialog(dialogData, ComplexGridEditPopupComponent)

    dialogRef.afterClosed().subscribe((result) => {
      const complex: Complex = {
        name: result.name,
        container: '',
        subjectId: this.subjectId,
        includeLabs: result.includeLabs,
        includeLectures: result.includeLectures,
        includeTests: result.includeTests,
      }
      this.showLoader = true
      this.complexService.addRootConcept(complex).subscribe((result) => {
        if (result['Code'] === '200') {
          this.showLoader = false
          this.router.navigateByUrl('/main')
        }
      })
    })
  }
}
