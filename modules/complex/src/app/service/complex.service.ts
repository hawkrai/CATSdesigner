import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ComplexGrid } from '../models/ComplexGrid';
import { ComplexCascade } from '../models/ComplexCascade';
import { ComplexTree } from '../models/ComplexTree';
import { ConverterService } from "./converter.service";

@Injectable({
  providedIn: 'root'
})

export class ComplexService {
  constructor(private http: HttpClient,
    private converterService: ConverterService) { }

  public getRootConcepts(subjectId: string): Observable<ComplexGrid[]> {
    return this.http.get('/Services/Concept/ConceptService.svc/GetRootConcepts?subjectId=' + subjectId).pipe(
      map(res => this.converterService.complexGridConverter(res['Concepts']))
    );
  }

  public getConceptCascade(parentId: string): Observable<ComplexCascade>{
    return this.http.get('/Services/Concept/ConceptService.svc/GetConceptCascade?parenttId=' + parentId).pipe(
      map(res => res['ConceptCascade'])
    );
  }

  public getConceptTree(parentId: string): Observable<ComplexTree> {
    return this.http.get('/Services/Concept/ConceptService.svc/GetConceptCascade?parenttId=' + parentId).pipe(
      map(res => this.converterService.mapConverter(res['ConceptCascade']))
    );
  }
}
