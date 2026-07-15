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
import { takeUntil, catchError, concatMap } from 'rxjs/operators'
import { Subject, forkJoin, from, of } from 'rxjs'
import { MenuService } from '../../../../../../../container/src/app/core/services/menu.service'
import { ModuleType } from '../../../../../../../container/src/app/core/models/module.model'
import { StorageKeys } from '../../../../../../../container/src/app/core/models/storage-keys.enum'
import { TestService } from '../../../service/test.service'
import { ConverterService } from '../../../service/converter.service'
import { TestResultsLoaderService } from '../../../service/test-results-loader.service'
import { HiddenTestsService } from '../../../service/hidden-tests.service'
import { ApiResponseCode } from '../../../models/api-response-code.enum'
import { ChangeDetectorRef } from '@angular/core'
import { TreeDragDropService, DragOverResult } from '../../../service/tree-drag-drop.service'
import { DropPlacement } from '../../../models/drop-placement.enum'
import { DragCssClass } from '../../../models/drag-css-class.enum'
import { LibreOfficeAvailabilityService } from '../../../service/libre-office-availability.service'

@Component({
  selector: 'app-material-tree',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.less'],
})
export class MaterialComponent implements OnInit, OnChanges {
  @Input() complexId: string
  isLecturer: boolean
  dropIndicatorNodeId: number | null = null
  dropInsideNodeId: number | null = null
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
    private cdr: ChangeDetectorRef,
    public treeDragDropService: TreeDragDropService,
    private libreOfficeAvailability: LibreOfficeAvailabilityService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false
    }
    this.router.onSameUrlNavigation = 'reload'

    const user = JSON.parse(localStorage.getItem(StorageKeys.CurrentUser))
    this.isLecturer = user.role === 'lector'
  }

  ngOnInit() {
    this.libreOfficeAvailability.getAvailability().subscribe()
    this.loadConceptCascade()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.complexId && !changes.complexId.firstChange && 
        changes.complexId.currentValue !== changes.complexId.previousValue) {
      this.loadConceptCascade()
    }
  }

  private loadConceptCascade(onComplete?: () => void): void {
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
          if (onComplete) onComplete()
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
            const lowerKey = key.toLowerCase()
            isSectionNode = lowerKey.includes('раздел') || lowerKey.includes('блок')
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
        const files = this.libreOfficeAvailability.isAvailable
          ? result.filter((file: string) => !file.toLowerCase().endsWith('.docx'))
          : result
        if (files.length > 0) {
          const path = '/api/Upload?fileName=' + files[0]
          const dialogRef = this.dialog.open(MaterialsPopoverComponent, {
            width: '1000px',
            height: '100%',
            data: { 
              name: 'name', 
              documents: files, 
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
    this._openPDFDialog(nodeId, filename)
  }

  private _openPDFDialog(nodeId: number, filename: string): void {
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
        .filter((child) => child.FilePath && (
          !this.libreOfficeAvailability.isAvailable || !child.FilePath.toLowerCase().endsWith('.docx')
        ))
        .map((child) => child.FilePath)
    }
    
    return nodes
      .filter((node) => node.FilePath && (
        !this.libreOfficeAvailability.isAvailable || !node.FilePath.toLowerCase().endsWith('.docx')
      ))
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
        children: node.children || [],
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.libreOfficeAvailability.resolveAvailability().subscribe((isLibreOfficeAvailable) => {
          const wasFolder = node.IsGroup
          const isNowFolder = result.isGroup
          const isNowFile = !result.isGroup
          const hasNoAttachments = !result.attachments || result.attachments.length === 0
          const hadNoInitialAttachments = !attachments || attachments.length === 0

          const userId = JSON.parse(localStorage.getItem(StorageKeys.CurrentUser)).id

          const initialAttachmentIds = new Set(
            (attachments || []).filter(a => a.id > 0).map(a => a.id)
          )

          const newFiles = isNowFolder
            ? (result.attachments || []).filter(
                (a: any) => !a.id || a.id === 0 || !initialAttachmentIds.has(a.id)
              )
            : []

          const convertedFromFileToFolder = !wasFolder && isNowFolder
          const fileToFolderAttachments = convertedFromFileToFolder
            ? (attachments || [])
            : []

          const convertedFromFolderToFile = wasFolder && isNowFile
          let folderToFileContainer: string | null = null
          if (convertedFromFolderToFile) {
            const children: any[] = node.children || []
            const childWithFile = children.find((c: any) => !c.IsGroup && c.FilePath)
            if (childWithFile && childWithFile.Attachments && childWithFile.Attachments.length > 0) {
              folderToFileContainer = childWithFile.Attachments[0].PathName
            }
          }

          let fileData: string
          if (isNowFile && hasNoAttachments && hadNoInitialAttachments && !folderToFileContainer) {
            fileData = JSON.stringify([])
          } else if (isNowFolder) {
            fileData = JSON.stringify([])
          } else if (convertedFromFolderToFile && folderToFileContainer) {
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
            container: folderToFileContainer || undefined,
            preserveFiles: convertedFromFileToFolder && fileToFolderAttachments.length > 0,
            skipConversion: !isLibreOfficeAvailable,
          }

          const deleteChildren$ = convertedFromFolderToFile
            ? (node.children || []).map((child: any) =>
                this.complexService.deleteConcept({ elementId: parseInt(child.Id, 10) })
              )
            : []

          const doSave = () => {
            this.complexService.addOrEditConcept(concept).subscribe((res) => {
              if (res['Code'] === ApiResponseCode.Success) {
                const allNewChildFiles = [
                  ...newFiles,
                  ...fileToFolderAttachments,
                ]
                const parentConceptId = res['SavedConceptId'] || result.id

                if (isNowFolder && allNewChildFiles.length > 0) {
                  from(allNewChildFiles).pipe(
                    concatMap((file: any) => {
                      const isExisting = file.id && file.id > 0
                      return this.complexService.addOrEditConcept({
                        conceptId: 0,
                        conceptName: this.stripFileExtension(file.name),
                        parentId: parentConceptId,
                        isGroup: false,
                        fileData: JSON.stringify([file]),
                        userId,
                        container: isExisting ? (file.pathName || undefined) : undefined,
                        skipConversion: !isLibreOfficeAvailable,
                      }).pipe(
                        catchError((error) => {
                          console.error('Error creating child concept:', error)
                          return of(null)
                        })
                      )
                    })
                  ).subscribe(() => {}, () => {}, () => this.loadConceptCascade())
                } else {
                  this.loadConceptCascade()
                }
              }
            })
          }

          if (deleteChildren$.length > 0) {
            forkJoin(deleteChildren$).subscribe(() => doSave())
          } else {
            doSave()
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

  isMandatoryNode(node: ComplexCascade): boolean {
    return !!(node as any).ReadOnly || !!node.isSectionNode || this.isMandatoryComponent(node)
  }

  onDragStart(event: DragEvent, node: ComplexCascade): void {
    event.stopPropagation()
    this.treeDragDropService.onDragStart(node)
    const el = event.target as HTMLElement
    if (el) {
      setTimeout(() => el.classList.add(DragCssClass.Dragging), 0)
    }
  }

  onDragOver(event: DragEvent, node: ComplexCascade): void {
    const target = (event.currentTarget as HTMLElement)
    const result = this.treeDragDropService.onDragOver(event, target, node, this.dataSource.data)
    if (result === DragOverResult.Pass) {
      return
    }
    event.stopPropagation()
    if (result === DragOverResult.Blocked) {
      this.dropIndicatorNodeId = null
      this.dropInsideNodeId = null
      return
    }
    const pos = this.treeDragDropService.dropPosition
    if (pos) {
      if (pos.placement === DropPlacement.Inside) {
        this.dropIndicatorNodeId = null
        this.dropInsideNodeId = Number(pos.targetNode.Id)
      } else if (pos.placement === DropPlacement.After) {
        this.dropInsideNodeId = null
        this.dropIndicatorNodeId = Number(pos.targetNode.Id)
      } else {
        this.dropInsideNodeId = null
        const parent = this.treeDragDropService.findParent(node, this.dataSource.data)
        const siblings = parent ? (parent.children || []) : this.dataSource.data
        const idx = siblings.findIndex(n => n.Id === node.Id)
        this.dropIndicatorNodeId = idx > 0 ? Number(siblings[idx - 1].Id) : null
      }
    }
  }

  onDragLeave(event: DragEvent): void {
    const related = event.relatedTarget as HTMLElement
    if (!related || !related.closest('mat-tree')) {
      this.dropIndicatorNodeId = null
      this.dropInsideNodeId = null
    }
  }

  onDrop(event: DragEvent, node: ComplexCascade): void {
    const target = event.currentTarget as HTMLElement
    const result = this.treeDragDropService.onDrop(event, target, node, this.dataSource.data)
    if (!result.handled) {
      return
    }
    event.stopPropagation()
    this.dropIndicatorNodeId = null
    this.dropInsideNodeId = null

    if (!result.position) return

    const { targetNode, placement } = result.position
    let newParentId: number
    let prevConceptId: number
    let nextConceptId: number

    if (placement === DropPlacement.Inside) {
      newParentId = Number(targetNode.Id)
      const children = (targetNode.children || []).filter(n => !n.TestId)
      prevConceptId = children.length > 0 ? Number(children[children.length - 1].Id) : 0
      nextConceptId = 0
    } else {
      const parent = this.treeDragDropService.findParent(targetNode, this.dataSource.data)
      const siblings = parent ? (parent.children || []) : this.dataSource.data
      const targetIdx = siblings.findIndex(n => n.Id === targetNode.Id)
      if (targetIdx === -1) return

      newParentId = parent ? Number(parent.Id) : Number(targetNode.ParentId)

      if (placement === DropPlacement.Before) {
        prevConceptId = targetIdx > 0 ? Number(siblings[targetIdx - 1].Id) : 0
        nextConceptId = Number(targetNode.Id)
      } else {
        prevConceptId = Number(targetNode.Id)
        nextConceptId = targetIdx < siblings.length - 1 ? Number(siblings[targetIdx + 1].Id) : 0
      }
    }

    const dragNode = this.treeDragDropService.dragNode
    this.treeDragDropService.onDragEnd()

    if (!dragNode) return

    this.complexService.moveConceptNode(
      Number(dragNode.Id),
      newParentId,
      prevConceptId,
      nextConceptId
    ).subscribe((res) => {
      if (res && res['Code'] === ApiResponseCode.Success) {
        localStorage.setItem(StorageKeys.SelectedComplex, this.complexId)
        window.location.reload()
      } else {
        this.catsService.showMessage({
          Message: this.translatePipe.transform('common.error.move', 'Не удалось переместить элемент'),
          Type: CodeType.error,
        })
      }
    }, () => {
      this.catsService.showMessage({
        Message: this.translatePipe.transform('common.error.move', 'Не удалось переместить элемент'),
        Type: CodeType.error,
      })
    })
  }

  onDragEnd(event: DragEvent): void {
    const el = event.target as HTMLElement
    if (el) el.classList.remove(DragCssClass.Dragging)
    this.treeDragDropService.onDragEnd()
    this.dropIndicatorNodeId = null
    this.dropInsideNodeId = null
  }

}
