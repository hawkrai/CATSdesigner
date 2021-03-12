import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentPreview } from '../models/DocumentPreview';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private _bookUrl = "api/Document/";
  private _serviceUrl = 'Services/Documents/DocumentService.svc/'

  constructor(private http: HttpClient) { }

  getDocumentsBySubjectId(subjectId, userId): Observable<DocumentPreview[]>{
    return this.http.get<any>(this._serviceUrl + "GetDocumentsBySubjectId?subjectid=" + subjectId + "&userId=" + userId).pipe(map(data=>{
      return data;
    }));
  }

  getDocumentsTreeBySubjectId(subjectId, userId): Observable<DocumentPreview[]>{
    return this.http.get<any>(this._serviceUrl + "GetDocumentsTreeBySubjectId?subjectId=" + subjectId + "&userId=" + userId).pipe(map(data=>{
      return data;
    }));
  }

  getContent(documentId) : Observable<any> {
    return this.http.get<DocumentPreview>(this._serviceUrl + "GetFullContent?documentId=" + documentId).pipe(map(data=>{
      return data;
    }));
  }

  saveDocument(document) {
    return this.http.post<any>(this._serviceUrl + "UpdateDocument", {document: document}).pipe(map(data=>{
      return data;
    }));
  }

  removeDocument(documentId) : Observable<any> {
    return this.http.get<any>(this._serviceUrl + "RemoveDocument?documentId=" + documentId).pipe(map(data=>{
      return data;
    }));
  }
}
