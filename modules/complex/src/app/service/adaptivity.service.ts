import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConverterService } from './converter.service'
import { Adaptivity } from '../models/Adaptivity'
import { StorageKeys } from '../../../../../container/src/app/core/models/storage-keys.enum'

@Injectable({
  providedIn: 'root',
})
export class AdaptivityService {
  private path: string

  constructor(
    private http: HttpClient,
    private converterService: ConverterService
  ) {
    this.path = '/Services/AdaptiveLearning/AdaptiveLearningService.svc/'
  }

  private readEumkRootConceptId(): number {
    const fromLocal = localStorage.getItem(StorageKeys.SelectedComplex)
    const fromSession = sessionStorage.getItem(StorageKeys.ComplexId)
    const raw = fromLocal || fromSession || '0'
    const n = parseInt(raw, 10)
    if (isNaN(n) || n <= 0) {
      return 0
    }
    return n
  }

  public getNextThemaRes(
    testId: string,
    conceptId: string,
    adaptivity: number
  ): Observable<Adaptivity> {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const subject = JSON.parse(localStorage.getItem('currentSubject'))

    return this.http
      .post(this.path + 'GetNextThema', {
        userId: user.id,
        subjectId: subject.id,
        testId: testId,
        currentThemaId: conceptId,
        adaptivityType: adaptivity,
        eumkRootConceptId: this.readEumkRootConceptId(),
      })
      .pipe(map((res) => this.converterService.nextThemaResConverter(res)))
  }

  public processPredTtest(
    testId: string,
    adaptivity: number
  ): Observable<Adaptivity> {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    return this.http
      .post(this.path + 'ProcessPredTestResults', {
        userId: user.id,
        testId: testId,
        adaptivityType: adaptivity,
        eumkRootConceptId: this.readEumkRootConceptId(),
      })
      .pipe(map((res) => this.converterService.nextThemaResConverter(res)))
  }

  public getTestId(
    themaId: string,
    monitoringRes: number,
    adaptivity: number
  ): Observable<number> {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const subject = JSON.parse(localStorage.getItem('currentSubject'))

    return this.http.post<number>(this.path + 'GetDynamicTestIdForThema', {
      userId: user.id,
      subjectId: subject.id,
      complexId: themaId,
      monitoringRes: monitoringRes,
      adaptivityType: adaptivity,
    })
  }

  public getFirstThema(adaptivityType: number): Observable<Adaptivity> {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const subject = JSON.parse(localStorage.getItem('currentSubject'))
    const eumkRoot = this.readEumkRootConceptId()

    return this.http
      .get(
        this.path +
          `GetFirstThema?userId=${user.id}&subjectId=${subject.id}&adaptivityType=${adaptivityType}&eumkRootConceptId=${eumkRoot}`
      )
      .pipe(map((res) => this.converterService.nextThemaResConverter(res)))
  }
}
