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

  public getNextThemaRes(userId: string, subjectId: string, conceptId: string, adaptivity: number): Observable<Adaptivity> {
    return this.http.get(`/Services/AdaptiveLearning/AdaptiveLearningService.svc/GetNextThema?userId=${userId}&subjectId=${subjectId}&complexId=${conceptId}&adaptivityType=${adaptivity}`).pipe(
      map(res => this.converterService.nextThemaResConverter(res))
    );;
  }

  public processPredTtest(userId: string, complexId: string) {
    return this.http.post('/Services/AdaptiveLearning/AdaptiveLearningService.svc/ProcessPredTestResults', {userId: userId, complexId: complexId});
  }

  public saveSelectedAdaptivity(userId: string, complexId: string, adaptivityType: string) {
    return this.http.post('/Services/AdaptiveLearning/AdaptiveLearningService.svc/SaveSelectedAdaptivityType', { userId: userId, complexId: complexId, adaptivityType: adaptivityType });
  }
 }
