import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ComplexGrid } from '../models/ComplexGrid'
import { ComplexCascade } from '../models/ComplexCascade'
import { ComplexTree } from '../models/ComplexTree'
import { Complex } from '../models/Complex'
import { Concept } from '../models/Concept'
import { ConverterService } from './converter.service'
import { ComplexStudentMonitoring } from '../models/ComplexStudentMonitoring'
import { ConceptMonitoringData } from '../models/ConceptMonitoringData'

@Injectable({
  providedIn: 'root',
})
export class ComplexService {
  private path: string

  constructor(
    private http: HttpClient,
    private converterService: ConverterService
  ) {
    this.path = '/Services/Concept/ConceptService.svc/'
  }

  public getRootConcepts(subjectId: string): Observable<ComplexGrid[]> {
    return this.http
      .get(this.path + 'GetRootConcepts?subjectId=' + subjectId)
      .pipe(
        map((res) =>
          this.converterService.complexGridConverter(res['Concepts'])
        )
      )
  }

  public getRootConceptsSubjectName(
    subjectId: string
  ): Observable<ComplexGrid[]> {
    return this.http
      .get(this.path + 'GetRootConcepts?subjectId=' + subjectId)
      .pipe(map((res) => res['SubjectName']))
  }

  public getConceptCascade(parentId: string): Observable<ComplexCascade> {
    return this.http
      .get(this.path + 'GetConceptCascade?parenttId=' + parentId)
      .pipe(map((res) => res['Concept']))
  }

  public getStudentComplexMonitoringInfo(
    comlexId: string,
    studentId: string
  ): Observable<ComplexStudentMonitoring> {
    return this.http.get<ComplexStudentMonitoring>(
      this.path +
        'GetStudentMonitoringInfo?complexId=' +
        comlexId +
        '&studentId=' +
        studentId
    )
  }

  public getConceptCascadeFoldersOnly(
    parentId: string
  ): Observable<ComplexCascade[]> {
    return this.http
      .get(this.path + 'GetConceptCascade?parenttId=' + parentId)
      .pipe(
        map((res) => this.converterService.filterNonGroupItems(res['Concept']))
      )
  }

  public getConceptTree(parentId: string): Observable<ComplexTree> {
    return this.http
      .get(this.path + 'GetConceptCascade?parenttId=' + parentId)
      .pipe(map((res) => this.converterService.mapConverter(res['Concept'])))
  }

  public getConceptMonitoring(
    conceptId: string,
    groupId: string
  ): Observable<ConceptMonitoringData> {
    return this.http
      .get(
        this.path +
          'GetConceptViews?conceptId=' +
          conceptId +
          '&groupId=' +
          groupId
      )
      .pipe(
        map((res) =>
          this.converterService.monitoringsConverter(
            res['Views'],
            res['Estimated']
          )
        )
      )
  }

  public getConceptNameById(conceptId: string): Observable<string> {
    return this.http
      .get(this.path + 'GetConcept?elementId=' + conceptId)
      .pipe(map((res) => res['Name']))
  }

  public editRootConcept(complex: Complex) {
    return this.http.post(this.path + 'EditRootConcept', complex)
  }

  public addRootConcept(complex: Complex) {
    return this.http.post(this.path + 'CreateRootConcept', complex)
  }

  public addOrEditConcept(concept: Concept) {
    return this.http.post(this.path + 'AddConcept', concept)
  }

  public deleteConcept(complex: Complex) {
    return this.http.post(this.path + 'Remove', complex)
  }

  public getConcepts(): Observable<any> {
    const subject = JSON.parse(localStorage.getItem('currentSubject'))
    return this.http.get<any>('/Tests/GetConcepts?subjectId=' + subject.id)
  }

  public getFilesForFolder(nodeId: number): Observable<string[]> {
    return this.http.get<string[]>(
      this.path + 'GetFolderFilesPaths?conceptId=' + nodeId
    )
  }

  public saveWatchingTime(conceptId: number, time: number) {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    return this.http.post(this.path + 'SaveMonitoringResult', {
      userId: user.id,
      conceptId: conceptId,
      timeInSeconds: time,
    })
  }
}
