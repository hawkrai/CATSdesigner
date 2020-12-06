import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ComplexGrid } from '../models/ComplexGrid';
import { ComplexCascade } from '../models/ComplexCascade';
import { ComplexTree } from '../models/ComplexTree';
import { ConceptMonitoring } from '../models/ConceptMonitoring';
import { Complex } from '../models/Complex';
import { ConverterService } from "./converter.service";
import { Adaptivity } from '../models/Adaptivity';

@Injectable({
  providedIn: 'root'
})

export class AdaptivityService {
  constructor(private http: HttpClient,
    private converterService: ConverterService) { }

  public getNextThemaRes(testId: string, conceptId: string, adaptivity: number): Observable<Adaptivity> {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const subject = JSON.parse(localStorage.getItem("currentSubject"));

    return this.http.post('/Services/AdaptiveLearning/AdaptiveLearningService.svc/GetNextThema', { userId: user.id, subjectId: subject.id, testId: testId, currentThemaId: conceptId, adaptivityType: adaptivity }).pipe(
      map(res => this.converterService.nextThemaResConverter(res))
    );
  }

  public processPredTtest(testId: string, adaptivity: number): Observable<Adaptivity> {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return this.http.post('/Services/AdaptiveLearning/AdaptiveLearningService.svc/ProcessPredTestResults', { userId: user.id, testId: testId, adaptivityType: adaptivity }).pipe(
      map(res => this.converterService.nextThemaResConverter(res))
    );
  }

  public getTestId(themaId: string, monitoringRes: number, adaptivity: number): Observable<number> {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const subject = JSON.parse(localStorage.getItem("currentSubject"));

    return this.http.post<number>('/Services/AdaptiveLearning/AdaptiveLearningService.svc/GetDynamicTestIdForThema', { userId: user.id, subjectId: subject.id, complexId: themaId, monitoringRes: monitoringRes, adaptivityType: adaptivity });
  }

  public getFirstThema(adaptivityType: number): Observable<Adaptivity> {
    debugger;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const subject = JSON.parse(localStorage.getItem("currentSubject"));

    return this.http.get(`/Services/AdaptiveLearning/AdaptiveLearningService.svc/GetFirstThema?userId=${user.id}&subjectId=${subject.id}&adaptivityType=${adaptivityType}`).pipe(
      map(res => this.converterService.nextThemaResConverter(res))
    );
  }
 }
