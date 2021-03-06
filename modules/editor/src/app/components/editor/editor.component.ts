import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { environment } from '../../../environments/environment';
import { IDocumentTree } from './../../models/DocumentTree';
import { TreeComponent } from '../tree/tree.component';
import { DocumentService } from './../../services/document.service';
import { DocumentPreview } from './../../models/DocumentPreview';

import { AddDocumentDialogComponent } from '../dialogs/add-document-dialog/add-document-dialog.component';
import { EditDocumentDialogComponent } from '../dialogs/edit-document-dialog/edit-document-dialog.component';
import { RemoveDocumentDialogComponent } from '../dialogs/remove-document-dialog/remove-document-dialog.component';

import * as Editor from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {

  @ViewChild(TreeComponent) treeChild : TreeComponent;

  // text editor & config
  editor = Editor;
  isEditorModelChanged: boolean = false;
  model = {
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

  // linear list of documents without nestes
  documents: DocumentPreview[];

  // info
  UserId: Number;
  SubjectId: Number;
  isReadOnly: Boolean;

  // tree
  treeControl = new NestedTreeControl<IDocumentTree>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<IDocumentTree>();
  linearTreeList = new Array<IDocumentTree>();
  hasChild = (_: number, node: IDocumentTree) => !!node.Children && node.Children.length > 0;

  // node
  currentNodeId: Number;
  currentDocument: DocumentPreview;

  constructor(private _bookService: DocumentService, public dialog: MatDialog) {}

  ngOnInit() {
    let currentSubject =  JSON.parse(localStorage.getItem("currentSubject"));
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.SubjectId = currentSubject ? currentSubject.id : 1;
    this.UserId = currentUser ? currentUser.id : 1;
    this.isReadOnly = currentUser ? currentUser.role != "lector" : environment.production;
    this.reloadTree();
  }

  ngOnDestroy() {
    if(!this.model.isReadOnly) {
      this.saveDocument(undefined);
    }
  }

  //TREE
  reloadTree() {
    this._bookService.getDocumentsBySubjectId(this.SubjectId).subscribe(data => {
      this.documents = data;
    });
    this._bookService.getDocumentsTreeBySubjectId(this.SubjectId).subscribe(data => {
      this.dataSource.data = data;
      this.treeControl.dataNodes = this.dataSource.data;
      this.updateLinearTreeNodesList();

      if(this.currentNodeId && this.currentNodeId != 0) {
        this.activateNode(this.currentNodeId);
        this.expand(this.dataSource.data, this.currentNodeId);
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
      if(node.Id == nodeId) {
        this.treeControl.expand(node);
      }
      else if (node.Children && node.Children.find(c => c.Id === nodeId)) {
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

  activateNode(documentId) {
    if(!this.model.isReadOnly && this.isEditorModelChanged) {
      this.saveDocument(undefined);
    }

    this._bookService.getContent(documentId).subscribe(doc => {
      this.model.editorData = doc.Text;
      this.currentDocument = doc;
    })
    this.currentNodeId = documentId;
    this.model.isReadOnly = true;

    this.treeControl.expand(this.linearTreeList.find(x => x.Id == documentId));
  }

  // DOCUMENT
  editDocument(document) {
    if(document.Children.length == 0 && document.Id != 0){
      this._bookService.getContent(document.Id).subscribe(doc => {
        this.model.editorData = doc.Text.replace(doc.Name, '');
        this.currentDocument = doc;
      })
      this.model.isReadOnly = false;
      this.currentNodeId = document.Id;
      this.treeControl.expand(document);
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
          this.currentNodeId = newDocument.Id;
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
    this.currentNodeId = document.Id;
    const dialogRef = this.dialog.open(RemoveDocumentDialogComponent, {
      data: { Id: document.Id, Name: document.Name }
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      this._bookService.removeDocument(newDocument).subscribe(res => {
        this.currentNodeId = this.getParentId(this.dataSource.data, this.currentNodeId);
        this.reloadTree();
      });
    });
  }

  openAddDialog(document): void {
    var data = {};

    if(document && document.Id) {
      this.currentNodeId = document.Id;

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
          this.currentNodeId = res;
          this.reloadTree();
        });;
      }
    });
  }

  onEditorModelChanged() {
    this.isEditorModelChanged = true;
  }

  // updates linear tree nodes list
  updateLinearTreeNodesList() {
    this.linearTreeList = new Array<IDocumentTree>();
    this.upd(this.dataSource.data);
  }

  upd(list) {
    list.forEach(el => {
      this.linearTreeList.push(el);
      return this.upd(el.Children);
    });
  }
}
