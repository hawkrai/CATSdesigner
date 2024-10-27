import { NestedTreeControl } from '@angular/cdk/tree'
import { Component, Input, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material'
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { MatDialog } from '@angular/material/dialog'
import { MaterialsPopoverComponent } from './materials-popover/materials-popover.component'
import { MonitoringPopoverComponent } from './monitoring-popover/monitoring-popover.component'
import { AddMaterialPopoverComponent } from '../../components/materials/add-material-popover/add-material-popover.component'
import { ComplexCascade } from '../../../models/ComplexCascade'
import { ComplexService } from '../../../service/complex.service'
import { Attachment } from '../../../models/Attachment'
import { ConvertedAttachment } from '../../../models/ConvertedAttachment'
import { Concept } from '../../../models/Concept'
import { Router } from '@angular/router'
import { Complex } from '../../../models/Complex'
import { TranslatePipe } from 'educats-translate'
import { CatsService, CodeType } from 'src/app/service/cats.service'
import { DeleteConfirmationPopupComponent } from './delete-confirmation-popup/delete-confirmation-popup.component'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-material-tree',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.less'],
})
export class MaterialComponent implements OnInit {
  @Input() complexId: string
  isLecturer: boolean
  treeControl = new NestedTreeControl<ComplexCascade>((node) => node.children)
  dataSource = new MatTreeNestedDataSource<ComplexCascade>()
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  attachmentConverter = (attachment: Attachment): ConvertedAttachment => ({
    id: attachment.Id,
    name: attachment.Name,
    pathName: attachment.PathName,
    fileName: attachment.FileName,
    attachmentType: attachment.AttachmentType,
  })

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private complexService: ComplexService,
    private translatePipe: TranslatePipe,
    private catsService: CatsService,
    private snackBar: MatSnackBar
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false
    }
    this.router.onSameUrlNavigation = 'reload'

    const user = JSON.parse(localStorage.getItem('currentUser'))
    this.isLecturer = user.role === 'lector'
  }

  ngOnInit() {
    this.complexService.getConceptCascade(this.complexId).subscribe((res) => {
      const localizedData = this.localizeTree(res.children)
      this.dataSource.data = localizedData
      this.treeControl.dataNodes = localizedData
      this.treeControl.expandAll()
    })
  }

  localizeTree(nodes: any[]): any[] {
    const translations = {
      'Титульный экран': 'complex.titleScreen',
      'Программа курса': 'complex.courseProgram',
      'Теоретический раздел': 'complex.section.theoretical',
      'Практический раздел': 'complex.section.practical',
      'Блок контроля знаний': 'complex.section.control',
    }

    return nodes.map((node) => {
      let localizedName = node.Name
      for (const key in translations) {
        if (translations.hasOwnProperty(key)) {
          if (node.Name.includes(key)) {
            localizedName = this.translatePipe.transform(translations[key], key)
            break
          }
        }
      }
      return {
        ...node,
        Name: localizedName,
        children: node.children ? this.localizeTree(node.children) : [],
      }
    })
  }

  openSnackBar(): void {
    this.snackBar.open(
      this.translatePipe.transform(
        'complex.noInfo',
        'Отсутствует информация по теме'
      ),
      '',
      {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['mat-warn'],
      }
    )
  }

  openFolderPDF(nodeId: number): void {
    this.complexService.getFilesForFolder(nodeId).subscribe((result) => {
      if (result) {
        const path = '/api/Upload?fileName=' + (result && result[0])
        const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
          width: '1000px',
          height: '100%',
          data: { name: 'name', documents: result, url: path },
        })

        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed')
        })
      }
    })
  }

  openPDF(nodeId: number, filename: string): void {
    const path = '/api/Upload?fileName=' + filename
    const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
      width: '1000px',
      height: '100%',
      data: { name: 'name', url: path },
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.complexService.saveWatchingTime(nodeId, result).subscribe()
      console.log('The dialog was closed')
    })
  }

  openMonitoring(nodeId: string, nodeName: string): void {
    const dialogRef = this.dialog.open(MonitoringPopoverComponent, {
      width: '800px',
      data: { title: 'Title', nodeId: nodeId, name: nodeName },
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed')
    })
  }

  openEditPopup(node: ComplexCascade): void {
    const attachments = node
      ? node.Attachments.map((x) => this.attachmentConverter(x))
      : []
    const dialogRef = this.dialog.open(AddMaterialPopoverComponent, {
      width: '600px',
      position: {
        left: '30%',
      },
      data: {
        id: node.Id,
        name: node.Name,
        isGroup: node.IsGroup,
        parentId: node.ParentId,
        attachments: attachments,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const concept: Concept = {
          conceptId: result.id,
          conceptName: result.name,
          parentId: result.parentId,
          isGroup: result.isGroup,
          fileData: JSON.stringify(result.attachments),
          userId: JSON.parse(localStorage.getItem('currentUser')).id,
        }

        this.complexService.addOrEditConcept(concept).subscribe((res) => {
          if (res['Code'] === '200') {
            this.router.navigateByUrl('/cMaterial')
          }
        })
      }
    })
  }

  hasChild = (_: number, node: ComplexCascade) =>
    node.IsGroup || (!!node.children && node.children.length > 0)

  public openConfirmationDialog(conceptId: number): void {
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
          this.onDeleteClick(conceptId)
        }
      })
  }

  onDeleteClick(conceptId: number): void {
    const complex: Complex = {
      elementId: conceptId,
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

        this.router.navigateByUrl('/cMaterial')
      }
    })
  }
}
