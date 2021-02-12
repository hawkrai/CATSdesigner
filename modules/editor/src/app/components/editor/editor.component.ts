import { Component, OnInit, ViewChild } from '@angular/core';
import * as Editor from 'ckeditor5-custom-build/build/ckeditor';
import { DocumentService } from 'src/app/services/document.service';
import { DocumentPreview } from 'src/app/models/DocumentPreview';
import { ModalService } from 'src/app/services/modal.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IDocumentTree } from 'src/app/models/DocumentTree';
import { MatDialog } from '@angular/material/dialog';
import { RemoveDocumentDialogComponent } from '../dialogs/remove-document-dialog/remove-document-dialog.component';
import { AddDocumentDialogComponent } from '../dialogs/add-document-dialog/add-document-dialog.component';
import { EditDocumentDialogComponent } from '../dialogs/edit-document-dialog/edit-document-dialog.component';
import { environment } from '../../../environments/environment';
import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {

  @ViewChild(TreeComponent) treeChild : TreeComponent;

  //Text editor
  public editor = Editor;
  isEditorModelChanged: boolean;
  public model = {
    editorData: '',
    isReadOnly: true,
    config: {
      placeholder: 'Введите содержание здесь...',
      toolbar: [ 'heading',
        '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'alignment', 'horizontalLine',
        '|', 'fontBackgroundColor', 'fontColor', 'fontSize', 'fontFamily',
        '|', 'indent', 'outdent',
        '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'exportPdf',// 'ckfinder',
        '|', 'MathType',
        '|', 'undo', 'redo' ],
    }
  }

  //Linear list of documents without nestes
  public documents: DocumentPreview[];

  //University subject. Zeros for test.
  public SubjectId: Number = 0;
  public UserId: Number = 0;
  public isReadOnly: Boolean = true;

  //Tree
  isAnyNodeExpanded = false;

  treeControl = new NestedTreeControl<IDocumentTree>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<IDocumentTree>();
  hasChild = (_: number, node: IDocumentTree) => !!node.Children && node.Children.length > 0;

  //Node
  public currentNodeHasChild = false;
  public currentNode: IDocumentTree = { Id: 0, Children: [], Name: '' };
  public currentDocument: DocumentPreview;

  //Search
  public searchField = "";

  constructor(private _bookService: DocumentService, private _modalService: ModalService, public dialog: MatDialog) {}

  ngOnInit() {
    var currentSubject =  JSON.parse(localStorage.getItem("currentSubject"));
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.SubjectId = currentSubject ? currentSubject.id : 1;
    this.UserId = currentUser ? currentUser.id : 1;
    this.isReadOnly = currentUser ? currentUser.role != "lector" ? true : false : environment.production;
    this.isEditorModelChanged = false;
    this.reloadTree();
  }

  //TREE
  reloadTree() {
    this._bookService.getDocumentsBySubjectId(this.SubjectId).subscribe(data => {
      this.documents = data;
    });
    this._bookService.getDocumentsTreeBySubjectId(this.SubjectId).subscribe(data => {
      this.dataSource.data = data;
      this.treeControl.dataNodes = this.dataSource.data;

      if(this.currentNode.Id != 0) {
        this.expand(this.dataSource.data, this.currentNode.Id);
        setTimeout(() => {
          const element = document.querySelector('.highlight');
          if (element) {
            element.scrollIntoView({behavior: 'smooth'});
          }
        });
      }
    });
  }

  expand(data: IDocumentTree[], nodeId: Number): any {
    data.forEach(node => {
      if (node.Children && node.Children.find(c => c.Id === nodeId)) {
        this.treeControl.expand(node);
        this.expand(this.treeControl.dataNodes, node.Id);
      }
      else if (node.Children && node.Children.find(c => c.Children)) {
        this.expand(node.Children, nodeId);
      }
    });
  }

  getParentId(data: IDocumentTree[], childNodeId: Number) : Number {
    var res: Number = 0;
    data.forEach(node => {
      if (node.Children && node.Children.find(c => c.Id === childNodeId)) {
        res = node.Id;
      }
      else {
        return this.getParentId(node.Children, childNodeId);
      }
    });
    return res;
  }

  onActivateTreeNodeEvent(document) {
    var node = document;
    this._bookService.getContent(node.Id).subscribe(doc => {
      this.model.editorData = doc.Text;
      this.currentDocument = doc;
    })
    this.currentNodeHasChild = node.Children.length > 0;
    this.currentNode = node;
    this.model.isReadOnly = true;

    this.treeControl.expand(node);
    if(this.treeControl.isExpanded(node)) {
      this.isAnyNodeExpanded = true;
    }
  }

  // DOCUMENT
  editDocument(document) {
    if(document.Children.length == 0 && document.Id != 0){
      this._bookService.getContent(document.Id).subscribe(doc => {
        this.model.editorData = doc.Text.replace(doc.Name, '');
        this.currentDocument = doc;
      })
      this.currentNodeHasChild = false;
      this.model.isReadOnly = false;
      this.currentNode = document;
      this.treeControl.expand(document);
      if(this.treeControl.isExpanded(document)) {
        this.isAnyNodeExpanded = true;
      }
    }
  }

  editStructure(node) {
    var document = this.documents.find(x => x.Id == node.Id);
    if(document) {
      const dialogRef = this.dialog.open(EditDocumentDialogComponent, {
        data: document
      });

      dialogRef.afterClosed().subscribe(newDocument => {
        if(newDocument) {
          this.currentNode.Id = newDocument.Id;
          this._bookService.saveDocument(newDocument).subscribe(res => {
            this.reloadTree();
          });
        }
      });
    }
  }

  saveDocument(event) {
    this.currentDocument.Text = this.model.editorData;
    this._bookService.saveDocument(this.currentDocument).subscribe(res => {
      this.reloadTree();
      this.model.isReadOnly = true;
    });
  }

  undoEditing() {
    this.model.editorData = this.currentDocument.Text;
    this.model.isReadOnly = true;
  }

  openRemoveDialog(document = undefined): void {
    const dialogRef = this.dialog.open(RemoveDocumentDialogComponent, {
      data: { Id: document.Id, Name: document.Name }
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      this._bookService.removeDocument(newDocument).subscribe(res => {
        this.currentNodeHasChild = true;
        this.currentNode.Id = this.getParentId(this.dataSource.data, this.currentNode.Id);
        this.reloadTree();
      });
    });
  }

  openAddDialog(document): void {
    var data = {};

    if(document && document.Id) {
      data = {
        ParentId: document.Id,
        Name: ''
      };
    }
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      if(newDocument) {
        if(newDocument.Id == undefined || newDocument.Id == 0) {
          newDocument.Id = 0;
          newDocument.Text = "";
          newDocument.UserId = this.UserId;
          newDocument.SubjectId = this.SubjectId;
        }
        this._bookService.saveDocument(newDocument).subscribe(res => {
          this.currentNodeHasChild = true;
          this.currentNode = { Id: 0, Children: [], Name: '' };
          this.reloadTree();
        });;
      }
    });
  }

  onEditorModelChanged() {
    this.isEditorModelChanged = true;
  }

  onExpandOrCollapseNode(node) {
    if(this.treeControl.isExpanded(node)) {
      this.isAnyNodeExpanded = true;
    }
    else {
      this.checkExpandedNodes(this.treeControl.dataNodes);
    }
  }

  checkExpandedNodes(nodes : IDocumentTree[]) {
    for(var i = 0; i < nodes.length; i++) {
      if(this.treeControl.isExpanded(nodes[i])) {
        this.isAnyNodeExpanded = true;
        break;
      }
      else if(nodes[i].Children?.length > 0) {
        this.checkExpandedNodes(nodes[i].Children);
      }
      else {
        this.isAnyNodeExpanded = false;
      }
    }
  }
}
