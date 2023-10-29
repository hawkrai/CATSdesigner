import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { NestedTreeControl } from '@angular/cdk/tree'
import { MatTreeNestedDataSource } from '@angular/material/tree'

import { environment } from '../../../environments/environment'
import { IDocumentTree } from './../../models/DocumentTree'
import { TreeComponent } from '../tree/tree.component'
import { DocumentService } from './../../services/document.service'
import { TestService } from './../../services/tests.service'
import { DocumentPreview } from './../../models/DocumentPreview'
import { TranslatePipe } from 'educats-translate'

import { AddDocumentDialogComponent } from '../dialogs/add-document-dialog/add-document-dialog.component'
import { EditDocumentDialogComponent } from '../dialogs/edit-document-dialog/edit-document-dialog.component'
import { RemoveDocumentDialogComponent } from '../dialogs/remove-document-dialog/remove-document-dialog.component'

import * as san from './../../helpers/string-helper'
import * as Editor from 'ckeditor5-custom-build/build/ckeditor'
import 'ckeditor5-custom-build/build/translations/ru'
import 'ckeditor5-custom-build/build/translations/en-gb'
import { Test } from 'src/app/models/tests/Test'
import { MatMenuTrigger } from '@angular/material/menu'
import { TestDialogComponent } from '../dialogs/test-dialog/test-dialog.component'
import { CopyToOtherSubjectDialogComponent } from '../dialogs/copy-to-other-subject-dialog/copy-to-other-subject-dialog.component'
import { CopyFromOtherSubjectDialogComponent } from '../dialogs/copy-from-other-subject-dialog/copy-from-other-subject-dialog.component'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @ViewChild(TreeComponent) treeChild: TreeComponent
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger

  // text editor & config
  editor = Editor
  isEditorModelChanged: boolean = false
  model = {
    editorData: '',
    isReadOnly: true,
    config: {
      language: san.helper.transformLanguageLine(
        localStorage.getItem('locale') ?? 'ru'
      ),
      placeholder: this.translatePipe.transform(
        'text.editor.hint.enter.content.here',
        'Введите содержимое здесь...'
      ),
      removePlugins: '',
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'alignment',
        'horizontalLine',
        '|',
        'fontBackgroundColor',
        'fontColor',
        'fontSize',
        'fontFamily',
        '|',
        'indent',
        'outdent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'exportPdf',
        'htmlEmbed', // 'ckfinder',
        '|',
        'MathType',
        '|',
        'undo',
        'redo',
      ],
      htmlEmbed: {
        showPreviews: true,
        sanitizeHtml: (inputHtml) => {
          const outputHtml = inputHtml

          return {
            html: outputHtml,
            hasChanged: true,
          }
        },
      },
    },
  }

  // linear list of documents without nestes
  documents: DocumentPreview[]

  // info
  UserId: Number
  SubjectId: Number
  isReadOnly: Boolean

  // tree
  showSpinner: Boolean
  treeControl = new NestedTreeControl<IDocumentTree>((node) => node.Children)
  dataSource = new MatTreeNestedDataSource<IDocumentTree>()
  linearTreeList = new Array<IDocumentTree>()
  hasChild = (_: number, node: IDocumentTree) =>
    !!node.Children && node.Children.length > 0

  // node
  currentNodeId: Number
  currentDocument: DocumentPreview

  // tests
  selfStudyTests: Test[]
  menuTopLeftPosition = { x: '0', y: '0' }

  constructor(
    private _bookService: DocumentService,
    private _testService: TestService,
    public translatePipe: TranslatePipe,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    let currentSubject = JSON.parse(localStorage.getItem('currentSubject'))
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))

    this.SubjectId = currentSubject ? currentSubject.id : 1
    this.UserId = currentUser ? currentUser.id : 1
    this.isReadOnly = currentUser
      ? currentUser.role != 'lector'
      : environment.production
    this.showSpinner = true
    this.reloadTree(true)
    this.configEditor()
    await this.updateSelfStudyTests()
  }

  configEditor() {
    if (this.isReadOnly) {
      this.model.config.removePlugins = 'toolbar'
    }
  }

  ngOnDestroy() {
    if (!this.model.isReadOnly) {
      this.saveDocument(undefined)
    }
  }

  isCanNowEdit() {
    return (
      this.documents &&
      this.documents.filter((d) => d.ParentId == this.currentNodeId).length == 0
    )
  }

  //TREE
  reloadTree(selectFirst = false) {
    this.treeControl.dataNodes = []
    this.dataSource.data = []
    this.showSpinner = true

    this._bookService
      .getDocumentsBySubjectId(this.SubjectId, this.UserId)
      .subscribe((data) => {
        this.documents = data
      })
    this._bookService
      .getDocumentsTreeBySubjectId(this.SubjectId, this.UserId)
      .subscribe((data) => {
        this.showSpinner = false
        this.dataSource.data = data
        this.treeControl.dataNodes = this.dataSource.data
        this.updateLinearTreeNodesList()

        if (selectFirst) {
          this.treeControl.expandAll()

          if (data.length) {
            this.activateNode(data[0].Id)
          }
        }

        if (this.currentNodeId && this.currentNodeId != 0) {
          this.activateNode(this.currentNodeId)
          this.expand(this.dataSource.data, this.currentNodeId)
          setTimeout(() => {
            const element = document.querySelector('.highlight')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          })
        }
      })
  }

  expand(data: IDocumentTree[], nodeId: Number): any {
    data.forEach((node) => {
      if (node.Id == nodeId) {
        this.treeControl.expand(node)
      } else if (node.Children && node.Children.find((c) => c.Id === nodeId)) {
        this.treeControl.expand(node)
        this.expand(this.treeControl.dataNodes, node.Id)
      } else if (node.Children && node.Children.find((c) => c.Children)) {
        this.expand(node.Children, nodeId)
      }
    })
  }

  getParentId(childNodeId: Number = this.currentNodeId): Number {
    let node = this.linearTreeList.find((n) =>
      n.Children.find((c) => c.Id == childNodeId)
    )

    return node ? node.Id : 0
  }

  activateNode(documentId) {
    if (!this.model.isReadOnly && this.isEditorModelChanged) {
      this.saveDocument(undefined)
    }

    this._bookService.getContent(documentId, this.UserId).subscribe((doc) => {
      this.model.editorData = doc.Text
      this.currentDocument = doc
    })
    this.currentNodeId = documentId
    this.model.isReadOnly = true

    this.treeControl.expand(this.linearTreeList.find((x) => x.Id == documentId))
  }

  // DOCUMENT
  editDocument(document) {
    if (
      document.Children &&
      document.Children.length == 0 &&
      document.Id != 0
    ) {
      //
      this._bookService
        .getContent(document.Id, this.UserId)
        .subscribe((doc) => {
          this.model.editorData = doc.Text.replace(doc.Name, '')
          this.currentDocument = doc
        })
      this.model.isReadOnly = false
      this.currentNodeId = document.Id
      this.treeControl.expand(document)
    } else if (document.Id != 0) {
      this._bookService
        .getContent(document.Id, this.UserId)
        .subscribe((doc) => {
          this.model.editorData = doc.Text.replace(doc.Name, '')
          this.currentDocument = doc
        })
      this.model.isReadOnly = false
      this.currentNodeId = document.Id
    }
  }

  editStructure(node) {
    var document = this.documents.find((x) => x.Id == node.Id)
    if (document) {
      const dialogRef = this.dialog.open(EditDocumentDialogComponent, {
        data: document,
        width: '30vw',
      })

      dialogRef.afterClosed().subscribe((newDocument) => {
        if (newDocument) {
          this.currentNodeId = newDocument.Id
          this._bookService.saveDocument(newDocument).subscribe((res) => {
            this.reloadTree()
          })
        }
      })
    }
  }

  saveDocument(event) {
    this.currentDocument.Text = this.model.editorData
    this._bookService.saveDocument(this.currentDocument).subscribe((res) => {
      this.reloadTree()
      this.model.isReadOnly = true
    })
  }

  undoEditing() {
    this.model.editorData = this.currentDocument.Text
    this.model.isReadOnly = true
  }

  openRemoveDialog(document = undefined): void {
    this.currentNodeId = document.Id
    const dialogRef = this.dialog.open(RemoveDocumentDialogComponent, {
      data: { Id: document.Id, Name: document.Name },
      width: '30vw',
    })

    dialogRef.afterClosed().subscribe((newDocument) => {
      this._bookService.removeDocument(newDocument).subscribe((res) => {
        this.currentNodeId = this.getParentId()
        this.reloadTree()
      })
    })
  }

  openAddDialog(document): void {
    var data = {}

    if (document && document.Id) {
      this.currentNodeId = document.Id

      data = {
        ParentId: document.Id,
        Name: '',
      }
    }
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      data: data,
      width: '30vw',
    })

    dialogRef.afterClosed().subscribe((newDocument) => {
      if (newDocument) {
        if (newDocument.Id == undefined || newDocument.Id == 0) {
          newDocument.Id = 0
          newDocument.Text = ''
          newDocument.UserId = this.UserId
          newDocument.SubjectId = this.SubjectId
          newDocument.IsLocked = false
        }
        this._bookService.saveDocument(newDocument).subscribe((res) => {
          this.currentNodeId = res
          this.reloadTree()
        })
      }
    })
  }

  onEditorModelChanged() {
    this.isEditorModelChanged = true
  }

  // updates linear tree nodes list
  updateLinearTreeNodesList() {
    this.linearTreeList = new Array<IDocumentTree>()
    this.upd(this.dataSource.data)
  }

  upd(list) {
    list.forEach((el) => {
      this.linearTreeList.push(el)
      return this.upd(el.Children)
    })
  }

  changeLockState(node) {
    this.currentNodeId = node.Id
    node.IsLocked = !node.IsLocked
    this._bookService.saveDocument(node).subscribe((res) => {
      this.reloadTree()
    })
  }

  // tests

  updateSelfStudyTests() {
    this.selfStudyTests = []
    return new Promise((resolve) => {
      this._testService
        .getAllTestLiteBySubjectId(this.SubjectId.toString())
        .subscribe((response) => {
          this.selfStudyTests = response.filter((test) => test.ForSelfStudy)
        })
    })
  }

  openTestModal(test) {
    const dialogRef = this.dialog.open(TestDialogComponent, {
      data: test,
      width: '100vw',
    })
  }

  openTestAddingModal(event) {
    event.preventDefault()

    if (this.isReadOnly) return

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX + 'px'
    this.menuTopLeftPosition.y = event.clientY + 'px'

    this.matMenuTrigger.menuData = { items: this.selfStudyTests }

    this.matMenuTrigger.openMenu()
  }

  openCopyToOtherSubjectDialog(document) {
    const dialogRef = this.dialog.open(CopyToOtherSubjectDialogComponent, {
      data: document,
      width: '50vw',
    })

    dialogRef.afterClosed().subscribe((documentSubject) => {
      if (documentSubject) {
        this._bookService
          .copyDocumentToSubject(
            documentSubject.documentId,
            documentSubject.subjectId
          )
          .subscribe((res) => {
            if (res) {
              //show success result
            }
          })
      }
    })
  }

  openCopyFromOtherSubjectDialog() {
    const dialogRef = this.dialog.open(CopyFromOtherSubjectDialogComponent, {
      data: {
        subjectId: this.SubjectId,
      },
      width: '50vw',
    })

    dialogRef.afterClosed().subscribe((documentSubject) => {
      if (documentSubject) {
        this._bookService
          .copyDocumentToSubject(
            documentSubject.documentId,
            documentSubject.subjectId
          )
          .subscribe((res) => {
            if (res) {
              //show success result
              this.reloadTree()
            }
          })
      }
    })
  }

  isSmallDevice() {
    return window.innerWidth <= 768
  }
}
