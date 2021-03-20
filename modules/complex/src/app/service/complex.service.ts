import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ComplexGrid } from '../models/ComplexGrid';
import { ComplexCascade } from '../models/ComplexCascade';
import { ComplexTree } from '../models/ComplexTree';
import { ConceptMonitoring } from '../models/ConceptMonitoring';
import { Complex } from '../models/Complex';
import { Concept } from '../models/Concept';
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

  public getRootConceptsSubjectName(subjectId: string): Observable<ComplexGrid[]> {
    return this.http.get('/Services/Concept/ConceptService.svc/GetRootConcepts?subjectId=' + subjectId).pipe(
      map(res => res['SubjectName'])
    );
  }

  public getConceptCascade(parentId: string): Observable<ComplexCascade>{
    return this.http.get('/Services/Concept/ConceptService.svc/GetConceptCascade?parenttId=' + parentId).pipe(
      map(res => res['Concept'])
    );
  }

  public getConceptCascadeFoldersOnly(parentId: string): Observable<ComplexCascade[]> {
    return this.http.get('/Services/Concept/ConceptService.svc/GetConceptCascade?parenttId=' + parentId).pipe(
      map(res => this.converterService.filterNonGroupItems(res['Concept']))
    );
  }

  public getConceptTree(parentId: string): Observable<ComplexTree> {
    return this.http.get('/Services/Concept/ConceptService.svc/GetConceptCascade?parenttId=' + parentId).pipe(
      map(res => this.converterService.mapConverter(res['Concept']))
    );
  }

  public getConceptMonitoring(conceptId: string, groupId: string): Observable<ConceptMonitoring[]> {
    return this.http.get('/Services/Concept/ConceptService.svc/GetConceptViews?conceptId=' + conceptId + '&groupId=' + groupId).pipe(
      map(res => this.converterService.monitoringsConverter(res['Views']))
    );
  }

  public getConceptNameById(conceptId: string): Observable<string> {
    return this.http.get('/Services/Concept/ConceptService.svc/GetConcept?elementId=' + conceptId).pipe(
      map(res => res['Name'])
    );
  }

  public editRootConcept(complex: Complex) {
    return this.http.post('/Services/Concept/ConceptService.svc/EditRootConcept', complex);
  }

  public addRootConcept(complex: Complex) {
    return this.http.post('/Services/Concept/ConceptService.svc/CreateRootConcept', complex);
  }

  public addOrEditConcept(concept: Concept) {
    return this.http.post('/Services/Concept/ConceptService.svc/AddConcept', concept);
  }

  public deleteConcept(complex: Complex) {
    return this.http.post('/Services/Concept/ConceptService.svc/Remove', complex);
  }

  public getConcepts(): Observable<any> {
    const subject = JSON.parse(localStorage.getItem("currentSubject"));
    return this.http.get<any>("/Tests/GetConcepts?subjectId=" + subject.id);
  }
}
