import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {

  //Text editor
  public editor = Editor;
  public model = {
    editorData: '',
    isReadOnly: true,
    config: {
      placeholder: 'Type the content here!',
      toolbar: [ 'heading',
        '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'alignment', 'horizontalLine',
        '|', 'fontBackgroundColor', 'fontColor', 'fontSize', 'fontFamily',
        '|', 'indent', 'outdent',
        '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'exportPdf',// 'ckfinder',
        '|', 'MathType',
        '|', 'undo', 'redo'
         ],
    }
  }

  //Linear list of documents without nestes
  public documents: DocumentPreview[];

  //University subject. Zeros for test.
  public SubjectId: Number = 0;
  public UserId: Number = 0;
  public isReadOnly: Boolean = true;

  //Tree
  treeControl = new NestedTreeControl<IDocumentTree>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<IDocumentTree>();
  hasChild = (_: number, node: IDocumentTree) => !!node.Children && node.Children.length > 0;

  //Node
  public currentNodeHasChild = false;
  public currentNodeId: Number = 0;
  public currentDocument: DocumentPreview;

  //Add new document
  public newDocument: DocumentPreview;

  //Search
  public searchField = "";

  constructor(private _bookService: DocumentService, private _modalService: ModalService, public dialog: MatDialog) {}

  ngOnInit() {
    var currentSubject =  JSON.parse(localStorage.getItem("currentSubject"));
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.SubjectId = currentSubject ? currentSubject.id : 1;
    this.UserId = currentUser ? currentUser.id : 1;
    this.isReadOnly = currentUser ? currentUser.role != "lector" ? true : false : true;
    this.newDocument = new DocumentPreview();
    this.reloadTree();
  }

  //TREE
  reloadTree() {
    this._bookService.getDocumentsBySubjectId(this.SubjectId).subscribe(data => {
      this.documents = data;
    });
    this._bookService.getDocumentsTreeBySubjectId(this.SubjectId).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  onActivateTreeNodeEvent(doc) {
    var node = doc.node;
    this._bookService.getContent(node.Id).subscribe(doc => {
      this.model.editorData = doc.Text;
      this.currentDocument = doc;
    })
    this.currentNodeHasChild = node.Children.length > 0;
    this.currentNodeId = node.Id;
    this.model.isReadOnly = true;
  }

  // DOCUMENT
  editDocument(event) {
    if(!this.currentNodeHasChild && this.currentNodeId != 0){
      this.model.isReadOnly = false;
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

  openRemoveDialog(document = undefined): void {
    const dialogRef = this.dialog.open(RemoveDocumentDialogComponent, {
      data: { Id: document.Id, Name: document.Name }
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      this._bookService.removeDocument(newDocument).subscribe(res => {
        this.reloadTree();
      });
    });
  }

  openAddDialog(document): void {
    var data = {};

    if(document && document.Id) {
      data = {
        ParentId: document.Id
      };
    }
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      if(newDocument) {
        if(newDocument.Id == undefined || newDocument.Id == 0) {
          newDocument.Id == 0
          newDocument.Text = "";
          newDocument.UserId = this.UserId;
          newDocument.SubjectId = this.SubjectId;
        }
        this._bookService.saveDocument(newDocument).subscribe(res => {
          this.reloadTree();
        });;
      }
    });
  }
}
