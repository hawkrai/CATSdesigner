import { Component, EventEmitter, OnInit, Input } from '@angular/core'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { forkJoin, from, of } from 'rxjs'
import { catchError, concatMap } from 'rxjs/operators'

import { ComplexService } from '../service/complex.service'
import { AddMaterialPopoverComponent } from './components/materials/add-material-popover/add-material-popover.component'
import { Concept } from '../models/Concept'
import { ComplexCascade } from '../models/ComplexCascade'
import { AdaptivityService } from '../service/adaptivity.service'
import { DialogData } from '../models/DialogData'
import { MaterialsPopoverComponent } from './components/materials/materials-popover/materials-popover.component'
import { TestService } from '../service/test.service'
import { StorageKeys } from '../../../../../container/src/app/core/models/storage-keys.enum'
import { ApiResponseCode } from '../models/api-response-code.enum'
import { LibreOfficeAvailabilityService } from '../service/libre-office-availability.service'

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
  public hasTheoryMaterials: boolean = false
  public isAdaptiveLearningDisabled: boolean = true

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private adaptivityService: AdaptivityService,
    private complexService: ComplexService,
    private testService: TestService,
    private libreOfficeAvailability: LibreOfficeAvailabilityService
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
    this.libreOfficeAvailability.getAvailability().subscribe()
    const savedComplexId = localStorage.getItem('selectedComplex')
    if (savedComplexId && savedComplexId !== this.complexID) {
      this.complexID = savedComplexId
      this.complexService
        .getConceptNameById(this.complexID)
        .subscribe((name) => (this.complexName = name))
    }
    this.checkAdaptiveLearningAvailability()
  }

  checkAdaptiveLearningAvailability(): void {
    forkJoin([
      this.testService.getPredTest().pipe(catchError(() => of(0))),
      this.complexService
        .getConceptCascade(this.complexID)
        .pipe(catchError(() => of(null))),
    ]).subscribe(([predTestId, conceptCascade]) => {
      this.hasPredTest = predTestId > 0
      this.hasTheoryMaterials = this.hasAttachmentsInCascade(conceptCascade)
      this.isAdaptiveLearningDisabled = !this.hasPredTest || !this.hasTheoryMaterials
    })
  }

  getAdaptiveLearningDisabledReason(): string {
    if (!this.hasPredTest && !this.hasTheoryMaterials) {
      return 'Отсутствуют предтест и прикрепленные материалы'
    }

    if (!this.hasPredTest) {
      return 'Отсутствует предтест'
    }

    if (!this.hasTheoryMaterials) {
      return 'Отсутствуют прикрепленные материалы'
    }

    return ''
  }

  private hasAttachmentsInCascade(node: ComplexCascade | ComplexCascade[] | any): boolean {
    if (!node) {
      return false
    }

    if (Array.isArray(node)) {
      return node.some((child) => this.hasAttachmentsInCascade(child))
    }

    const attachments = node.Attachments || node.attachments
    if (Array.isArray(attachments) && attachments.length > 0) {
      return true
    }

    const filePath = node.FilePath || node.filePath || node.PathName || node.pathName
    if (typeof filePath === 'string' && filePath.trim().length > 0) {
      return true
    }

    const children = node.children || node.Children
    if (!Array.isArray(children) || children.length === 0) {
      return false
    }

    return children.some((child) => this.hasAttachmentsInCascade(child))
  }

  openAddPopup(): void {
    const currentComplexID = localStorage.getItem(StorageKeys.SelectedComplex)
    const dialogRef = this.dialog.open(AddMaterialPopoverComponent, {
      width: '600px',
      data: { 
        id: '0', 
        attachments: [],
        parentId: currentComplexID ? parseInt(currentComplexID, 10) : null
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.libreOfficeAvailability.resolveAvailability().subscribe((isLibreOfficeAvailable) => {
          const userId = JSON.parse(localStorage.getItem(StorageKeys.CurrentUser)).id
          const isFolder = result.isGroup
          const hasAttachments = result.attachments && result.attachments.length > 0
          const fileData = isFolder ? JSON.stringify([]) : JSON.stringify(result.attachments || [])

          const concept: Concept = {
            conceptId: +result.id,
            conceptName: result.name,
            parentId: result.parentId,
            isGroup: result.isGroup,
            fileData: fileData,
            userId: userId,
            skipConversion: !isLibreOfficeAvailable,
          }

          this.complexService.addOrEditConcept(concept).subscribe((res) => {
            if (res['Code'] === ApiResponseCode.Success) {
              if (isFolder && hasAttachments) {
                const savedConceptId = res['SavedConceptId']

                from(result.attachments).pipe(
                  concatMap((file: any) => {
                    const isExisting = file.id && file.id > 0
                    return this.complexService.addOrEditConcept({
                      conceptId: 0,
                      conceptName: this.stripFileExtension(file.name),
                      parentId: savedConceptId,
                      isGroup: false,
                      fileData: JSON.stringify([file]),
                      userId: userId,
                      container: isExisting ? (file.pathName || undefined) : undefined,
                      skipConversion: !isLibreOfficeAvailable,
                    }).pipe(
                      catchError((error) => {
                        console.error('Error creating child concept:', error)
                        return of(null)
                      })
                    )
                  })
                ).subscribe(() => {}, () => {}, () => {
                  this.router.navigateByUrl('/cMaterial').then(() => {
                    window.location.reload()
                  })
                })
              } else {
                this.router.navigateByUrl('/cMaterial').then(() => {
                  window.location.reload()
                })
              }
            }
          })
        })
      }
    })
  }

  private stripFileExtension(name: string): string {
    return name ? name.replace(/\.(pdf|docx?|doc)$/i, '') : name
  }

  openAdaptivityPopup(adaptivityType: number): void {
    if (this.hasPredTest && this.hasTheoryMaterials) {
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
