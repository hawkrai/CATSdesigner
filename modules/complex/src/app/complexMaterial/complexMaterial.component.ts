import { Component, EventEmitter, OnInit, Input } from '@angular/core'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'

import { ComplexService } from '../service/complex.service'
import { AddMaterialPopoverComponent } from './components/materials/add-material-popover/add-material-popover.component'
import { Concept } from '../models/Concept'
import { AdaptivityService } from '../service/adaptivity.service'
import { DialogData } from '../models/DialogData'
import { MaterialsPopoverComponent } from './components/materials/materials-popover/materials-popover.component'
import { TestService } from '../service/test.service'
import { StorageKeys } from '../../../../../container/src/app/core/models/storage-keys.enum'

@Component({
  selector: 'app-labs',
  templateUrl: './complexMaterial.component.html',
  styleUrls: ['./complexMaterial.component.less'],
})
export class ComplexMaterialComponent implements OnInit {
  public tab = 1
  public complexID
  public complexName: string
  isLector: boolean
  public hasPredTest: boolean = false
  public isAdaptiveLearningDisabled: boolean = false

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private adaptivityService: AdaptivityService,
    private complexService: ComplexService,
    private testService: TestService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false
    }
    this.router.onSameUrlNavigation = 'reload'

    this.complexID = this.router.getCurrentNavigation().extras.state
    if (this.complexID) {
      localStorage.setItem(StorageKeys.SelectedComplex, this.complexID)
    } else {
      this.complexID = localStorage.getItem(StorageKeys.SelectedComplex)
    }
    this.complexService
      .getConceptNameById(this.complexID)
      .subscribe((name) => (this.complexName = name))

    this.isLector =
      JSON.parse(localStorage.getItem(StorageKeys.CurrentUser)).role === 'lector'
  }

  ngOnInit(): void {
    const savedComplexId = localStorage.getItem('selectedComplex')
    if (savedComplexId && savedComplexId !== this.complexID) {
      this.complexID = savedComplexId
      this.complexService
        .getConceptNameById(this.complexID)
        .subscribe((name) => (this.complexName = name))
    }
    this.checkForPredTest()
  }

  checkForPredTest(): void {
    this.testService.getPredTest().subscribe((predTestId) => {
      this.hasPredTest = predTestId > 0
      this.isAdaptiveLearningDisabled = !this.hasPredTest
    })
  }

  openAddPopup(): void {
    const dialogRef = this.dialog.open(AddMaterialPopoverComponent, {
      width: '600px',
      data: { id: '0', attachments: [] },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const concept: Concept = {
          conceptId: +result.id,
          conceptName: result.name,
          parentId: result.parentId,
          isGroup: result.isGroup,
          fileData: JSON.stringify(result.attachments),
          userId: JSON.parse(localStorage.getItem(StorageKeys.CurrentUser)).id,
        }

        this.complexService.addOrEditConcept(concept).subscribe((res) => {
          if (res['Code'] === '200') {
            this.router.navigateByUrl('/cMaterial').then(() => {
              window.location.reload()
            })
          }
        })
      }
    })
  }

  openAdaptivityPopup(adaptivityType: number): void {
    if (this.hasPredTest) {
      this.adaptivityService
        .getFirstThema(adaptivityType)
        .subscribe((themaRes) => {
          const path =
            '/api/Upload?fileName=' +
            (themaRes.nextMaterialPaths && themaRes.nextMaterialPaths[0])
          const diaogData: DialogData = {
            name: `${themaRes.nextThemaId}`,
            url: path,
            adaptivityType: adaptivityType,
            isAdaptive: true,
            adaptivity: themaRes,
          }

          const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
            width: '100%',
            height: '100%',
            data: diaogData,
          })

          dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed')
          })
        })
    }
  }

  navigateToComplexList(): void {
    localStorage.removeItem(StorageKeys.SelectedComplex)
    this.router.navigate(['/main'])
  }
}
