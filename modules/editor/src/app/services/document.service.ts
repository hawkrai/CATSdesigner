import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentPreview } from '../models/DocumentPreview';
import { IDocumentTree } from '../models/DocumentTree';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private _bookUrl = "https://localhost:5001/api/documents/";

  constructor(private http: HttpClient, private _router: Router) { }

  getDocumentsBySubjectId(subjectId): Observable<DocumentPreview[]>{
    return this.http.get<any>(this._bookUrl + "get-documents?subjectId=" + subjectId).pipe(map(data=>{
      return data;
    }));
  }

  getDocumentsTreeBySubjectId(subjectId): Observable<DocumentPreview[]>{
    return this.http.get<any>(this._bookUrl + "get-documents-tree?subjectId=" + subjectId).pipe(map(data=>{
      return data;
    }));
  }

  getContent(documentId) : Observable<any> {
    return this.http.get<DocumentPreview>(this._bookUrl + "get-content?documentId=" + documentId).pipe(map(data=>{
      return data;
    }));
  }

  saveDocument(document) {
    return this.http.post<any>(this._bookUrl + "update-document", document).pipe(map(data=>{
      return data;
    }));
  }

  removeDocument(documentId) : Observable<any> {
    return this.http.get<any>(this._bookUrl + "remove-document?documentId=" + documentId).pipe(map(data=>{
      return data;
    }));
  }
}
