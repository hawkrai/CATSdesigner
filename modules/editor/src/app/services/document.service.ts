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

  private _bookUrl = "api/Document/";
  private _serviceUrl = 'Services/Documents/DocumentService.svc/'

  constructor(private http: HttpClient, private _router: Router) { }

  getDocumentsBySubjectId(subjectId): Observable<DocumentPreview[]>{
    return this.http.get<any>(this._serviceUrl + "GetDocumentsBySubjectId?subjectid=" + subjectId).pipe(map(data=>{
      return data;
    }));
  }

  getDocumentsTreeBySubjectId(subjectId): Observable<DocumentPreview[]>{
    return this.http.get<any>(this._serviceUrl + "GetDocumentsTreeBySubjectId?subjectId=" + subjectId).pipe(map(data=>{
      return data;
    }));
  }

  getContent(documentId) : Observable<any> {
    return this.http.get<DocumentPreview>(this._serviceUrl + "GetFullContent?documentId=" + documentId).pipe(map(data=>{
      return data;
    }));
  }

  saveDocument(document) {
    return this.http.post<any>(this._bookUrl + "UpdateDocument", document).pipe(map(data=>{
      return data;
    }));
  }

  removeDocument(documentId) : Observable<any> {
    return this.http.get<any>(this._bookUrl + "RemoveDocument?documentId=" + documentId).pipe(map(data=>{
      return data;
    }));
  }
}
