/* eslint-disable prettier/prettier */
import { NestedTreeControl } from '@angular/cdk/tree'
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core'
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
import { Subject, forkJoin, of } from 'rxjs'
import { MenuService } from '../../../../../../../container/src/app/core/services/menu.service'
import { ModuleType } from '../../../../../../../container/src/app/core/models/module.model'
import { StorageKeys } from '../../../../../../../container/src/app/core/models/storage-keys.enum'
import { TestService } from '../../../service/test.service'
import { ConverterService } from '../../../service/converter.service'
import { TestResultsLoaderService } from '../../../service/test-results-loader.service'
import { HiddenTestsService } from '../../../service/hidden-tests.service'
import { ApiResponseCode } from '../../../models/api-response-code.enum'
import { ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'app-material-tree',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.less'],
})
export class MaterialComponent implements OnInit, OnChanges {
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
    private snackBar: MatSnackBar,
    private menuService: MenuService,
    private testService: TestService,
    public converterService: ConverterService,
    private testResultsLoaderService: TestResultsLoaderService,
    private hiddenTestsService: HiddenTestsService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false
    }
    this.router.onSameUrlNavigation = 'reload'

    const user = JSON.parse(localStorage.getItem(StorageKeys.CurrentUser))
    this.isLecturer = user.role === 'lector'
  }

  ngOnInit() {
    this.loadConceptCascade()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.complexId && !changes.complexId.firstChange && 
        changes.complexId.currentValue !== changes.complexId.previousValue) {
      this.loadConceptCascade()
    }
  }

  private loadConceptCascade(): void {
    if (!this.complexId) {
      return
    }

    this.hiddenTestsService.loadHiddenTests(this.complexId).subscribe(
      () => {
        this.complexService.getConceptCascade(this.complexId).subscribe((res) => {
          const localizedData = this.localizeTree(res.children)
          const getTestNodes = (nodes: ComplexCascade[]): ComplexCascade[] => {
            const result: ComplexCascade[] = []
            const walk = (list: ComplexCascade[]) => {
              list.forEach(n => {
                if (n.TestId) result.push(n)
                if (n.children && n.children.length) walk(n.children)
              })
            }
            walk(nodes)
            return result
          }
          console.log('[HiddenTests] Тесты до фильтрации:', getTestNodes(localizedData).map(n => ({ Id: n.Id, TestId: n.TestId, Name: n.Name })))
          const filteredData = this.hiddenTestsService.filterHiddenTestsForCascade(this.complexId, localizedData)
          console.log('[HiddenTests] Тесты после фильтрации:', getTestNodes(filteredData).map(n => ({ Id: n.Id, TestId: n.TestId, Name: n.Name })))
          this.dataSource.data = filteredData
          this.treeControl.dataNodes = filteredData
          this.treeControl.expandAll()
          this.loadTestResults(filteredData)
        })
      },
      () => {
        console.error('[HiddenTests] loadHiddenTests вернул ошибку — дерево без фильтрации')
        this.complexService.getConceptCascade(this.complexId).subscribe((res) => {
          const localizedData = this.localizeTree(res.children)
          const filteredData = this.hiddenTestsService.filterHiddenTestsForCascade(this.complexId, localizedData)
          this.dataSource.data = filteredData
          this.treeControl.dataNodes = filteredData
          this.treeControl.expandAll()
          this.loadTestResults(filteredData)
        })
      }
    )
  }




  loadTestResults(nodes: ComplexCascade[]): void {
    const user = JSON.parse(localStorage.getItem(StorageKeys.CurrentUser))
    if (!user || !user.id) {
      return
    }

    this.testResultsLoaderService.loadTestResults(
      nodes,
      user.id,
      (nodes, testNodes) => this.collectTestNodes(nodes, testNodes),
      this.cdr
    )
  }

  collectTestNodes(nodes: any[], testNodes: any[]): void {
    nodes.forEach((node) => {
      if (node.TestId) {
        testNodes.push(node)
      }
      if (node.children || node.Children) {
        this.collectTestNodes(node.children || node.Children, testNodes)
      }
    })
  }

  getTestScoreColor(points: number): string {
    return this.testResultsLoaderService.getTestScoreColor(points)
  }

  getTestTooltip(node: ComplexCascade): string {
    return this.testResultsLoaderService.getTestTooltip(node)
  }

  getTestScoreText(points: number): string {
    return this.testResultsLoaderService.getTestScoreText(points)
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
      let isSectionNode = false
      for (const key in translations) {
        if (translations.hasOwnProperty(key)) {
          if (node.Name.includes(key)) {
            localizedName = this.translatePipe.transform(translations[key], key)
            key.includes('раздел') || key.includes('блок') ? isSectionNode = true : isSectionNode = false
            break
          }
        }
      }
      localizedName = this.stripFileExtension(localizedName)
      return {
        ...node,
        Name: localizedName,
        isSectionNode,
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
        const pdfFiles = result.filter((file: string) => !file.toLowerCase().endsWith('.docx'))
        if (pdfFiles.length > 0) {
          const path = '/api/Upload?fileName=' + pdfFiles[0]
          const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
            width: '1000px',
            height: '100%',
            data: { 
              name: 'name', 
              documents: pdfFiles, 
              url: path,
              currentIndex: 0
            },
          })

          dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed')
          })
        }
      }
    })
  }

  openPDF(nodeId: number, filename: string): void {
    const path = '/api/Upload?fileName=' + filename
    const siblingMaterials = this.collectSiblingMaterials(this.dataSource.data, nodeId)
    const currentIndex = siblingMaterials.findIndex((mat) => mat === filename)
    
    const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
      width: '1000px',
      height: '100%',
      data: { 
        name: 'name', 
        url: path,
        documents: siblingMaterials,
        currentIndex: currentIndex >= 0 ? currentIndex : 0
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.complexService.saveWatchingTime(nodeId, result).subscribe()
      console.log('The dialog was closed')
    })
  }

  private collectSiblingMaterials(nodes: ComplexCascade[], nodeId: number): string[] {
    const targetNode = this.findNodeById(nodes, nodeId)
    
    if (!targetNode) {
      return []
    }

    const parentNode = this.findParentNode(nodes, nodeId)
    
    if (parentNode && parentNode.children) {
      return parentNode.children
        .filter((child) => child.FilePath && !child.FilePath.toLowerCase().endsWith('.docx'))
        .map((child) => child.FilePath)
    }
    
    return nodes
      .filter((node) => node.FilePath && !node.FilePath.toLowerCase().endsWith('.docx'))
      .map((node) => node.FilePath)
  }

  private findNodeById(nodes: ComplexCascade[], nodeId: number): ComplexCascade | null {
    for (const node of nodes) {
      if (String(node.Id) === String(nodeId)) {
        return node
      }
      if (node.children && node.children.length > 0) {
        const found = this.findNodeById(node.children, nodeId)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  private findParentNode(nodes: ComplexCascade[], nodeId: number): ComplexCascade | null {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const childMatch = node.children.find((child) => String(child.Id) === String(nodeId))
        if (childMatch) {
          return node
        }
        const found = this.findParentNode(node.children, nodeId)
        if (found) {
          return found
        }
      }
    }
    return null
  }
  
  openTest(node: any) {
    if (node.TestId) {
      const { item } = this.menuService.getSubjectInfo(ModuleType.SmartTest)
      const { item: eumkItem } = this.menuService.getSubjectInfo(
        ModuleType.ComplexMaterial
      )

      const currentSubject = localStorage.getItem(StorageKeys.CurrentSubject)
      const subject = JSON.parse(currentSubject)

      sessionStorage.setItem(StorageKeys.ComplexTestId, node.TestId)
      sessionStorage.setItem(StorageKeys.TestFromComplex, 'true')
      sessionStorage.setItem(StorageKeys.ComplexId, this.complexId)
      sessionStorage.setItem(
        StorageKeys.ComplexRoute,
        `web/viewer/subject/${subject.id}#${eumkItem}`
      )

      this.catsService.sendMessage({
        Type: 'Route',
        Value: `web/viewer/subject/${subject.id}#${item}`,
      })
    }
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
    
    const mandatoryComponents = [
      'Титульный экран',
      'Программа курса',
      'Теоретический раздел',
      'Практический раздел',
      'Блок контроля знаний',
    ]
    const translatedComponents = [
      this.translatePipe.transform('complex.titleScreen', 'Титульный экран'),
      this.translatePipe.transform('complex.courseProgram', 'Программа курса'),
      this.translatePipe.transform('complex.section.theoretical', 'Теоретический раздел'),
      this.translatePipe.transform('complex.section.practical', 'Практический раздел'),
      this.translatePipe.transform('complex.section.control', 'Блок контроля знаний'),
    ]
    const nodeName = node.Name || ''
    const isMandatoryComponent = mandatoryComponents.some((comp) =>
      nodeName.includes(comp)
    ) || translatedComponents.some((comp) =>
      nodeName.includes(comp)
    )
    
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
        testId: node.TestId,
        isMandatoryComponent: isMandatoryComponent,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const isFile = !result.isGroup
        const hasNoAttachments = !result.attachments || result.attachments.length === 0
        const hadNoInitialAttachments = !attachments || attachments.length === 0

        const userId = JSON.parse(localStorage.getItem(StorageKeys.CurrentUser)).id

        const initialAttachmentIds = new Set(
          (attachments || []).filter(a => a.id > 0).map(a => a.id)
        )
        const newFiles = result.isGroup
          ? (result.attachments || []).filter(
              (a: any) => !a.id || a.id === 0 || !initialAttachmentIds.has(a.id)
            )
          : []

        // Для папки не передаём файлы в fileData — они пойдут как дочерние концепты
        let fileData: string
        if (isFile && hasNoAttachments && hadNoInitialAttachments) {
          fileData = JSON.stringify([])
        } else if (result.isGroup) {
          fileData = JSON.stringify([])
        } else {
          fileData = JSON.stringify(result.attachments || [])
        }

        const concept: Concept = {
          conceptId: result.id,
          conceptName: result.name,
          parentId: result.parentId,
          isGroup: result.isGroup,
          fileData: fileData,
          userId,
        }

        this.complexService.addOrEditConcept(concept).subscribe((res) => {
          if (res['Code'] === ApiResponseCode.Success) {
            // Создаём дочерние концепты для каждого нового файла папки
            if (result.isGroup && newFiles.length > 0) {
              const childConcepts$ = newFiles.map((file: any) =>
                this.complexService.addOrEditConcept({
                  conceptId: 0,
                  conceptName: this.stripFileExtension(file.name),
                  parentId: result.id,
                  isGroup: false,
                  fileData: JSON.stringify([file]),
                  userId,
                })
              )
              forkJoin(childConcepts$).subscribe(() => this.loadConceptCascade())
            } else {
              this.loadConceptCascade()
            }
          }
        })
      }
    })
  }

  hasChild = (_: number, node: ComplexCascade) =>
    node.IsGroup || (!!node.children && node.children.length > 0)

  private stripFileExtension(name: string): string {
    return name.replace(/\.(pdf|docx?|doc)$/i, '')
  }

  isLeafClickable(node: ComplexCascade): boolean {
    return !!(node.FilePath || node.TestId)
  }

  isGroupClickable(node: ComplexCascade): boolean {
    return (
      !node.isSectionNode &&
      !!node.children &&
      node.children.length > 0 &&
      !!node.Attachments &&
      node.Attachments.length > 0
    )
  }

  hasContent(node: ComplexCascade): boolean {
    const selfHasContent = !!(
      node.FilePath ||
      node.TestId ||
      (node.Attachments && node.Attachments.length > 0)
    )

    if (selfHasContent) {
      return true
    }

    if (node.children && node.children.length > 0) {
      return node.children.some((child) => this.hasContent(child))
    }

    return false
  }

  public openConfirmationDialog(conceptId: string | number, node?: ComplexCascade): void {
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
          this.onDeleteClick(conceptId, node)
        }
      })
  }

  onDeleteClick(conceptId: string | number, node?: ComplexCascade): void {
    if (node && node.TestId) {
      this.hiddenTestsService.saveHiddenTest(this.complexId, String(conceptId), node.TestId).subscribe()
      this.hideTestFromTree(conceptId, node)
      this.catsService.showMessage({
        Message: `${this.translatePipe.transform(
          'common.success.operation',
          'Успешно удалено'
        )}.`,
        Type: CodeType.success,
      })
      return
    }
    const complex: Complex = {
      elementId: typeof conceptId === 'string' ? parseInt(conceptId, 10) : conceptId,
    }
    this.complexService.deleteConcept(complex).subscribe((result) => {
      if (result['Code'] === ApiResponseCode.Success) {
        this.catsService.showMessage({
          Message: `${this.translatePipe.transform(
            'common.success.operation',
            'Успешно удалено'
          )}.`,
          Type: CodeType.success,
        })

        this.loadConceptCascade()
      }
    })
  }

  private hideTestFromTree(conceptId: string | number, nodeToRemove: ComplexCascade): void {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      return
    }
    const expandedNodeIds = this.hiddenTestsService.collectExpandedNodeIds(
      this.dataSource.data,
      (node) => this.treeControl.isExpanded(node)
    )

    const newData = this.hiddenTestsService.removeCascadeNode(
      this.dataSource.data,
      conceptId
    )

    this.dataSource.data = newData
    this.treeControl.dataNodes = newData

    setTimeout(() => {
      this.hiddenTestsService.restoreExpandedState(
        newData,
        expandedNodeIds,
        (node) => this.treeControl.expand(node)
      )
      this.cdr.detectChanges()
    }, 0)
  }

  isMandatoryComponent(node: ComplexCascade): boolean {
    const mandatoryComponents = [
      'Титульный экран',
      'Программа курса',
      'Теоретический раздел',
      'Практический раздел',
      'Блок контроля знаний',
    ]
    const translatedComponents = [
      this.translatePipe.transform('complex.titleScreen', 'Титульный экран'),
      this.translatePipe.transform('complex.courseProgram', 'Программа курса'),
      this.translatePipe.transform('complex.section.theoretical', 'Теоретический раздел'),
      this.translatePipe.transform('complex.section.practical', 'Практический раздел'),
      this.translatePipe.transform('complex.section.control', 'Блок контроля знаний'),
    ]
    const nodeName = node.Name || ''
    return mandatoryComponents.some((comp) =>
      nodeName.includes(comp)
    ) || translatedComponents.some((comp) =>
      nodeName.includes(comp)
    )
  }

}
