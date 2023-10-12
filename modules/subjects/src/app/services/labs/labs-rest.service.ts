import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { CreateLessonEntity } from './../../models/form/create-lesson-entity.model'
import { StudentMark } from './../../models/student-mark.model'
import { Lab } from '../../models/lab.model'
import { UpdateLab } from 'src/app/models/form/update-lab.model'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { ScheduleProtectionLab } from 'src/app/models/schedule-protection/schedule-protection-lab.model'
import { HasGroupJobProtection } from 'src/app/models/job-protection/has-group-job-protection.model'
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model'
import { SubGroup } from 'src/app/models/sub-group.model'
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode'

@Injectable({
  providedIn: 'root',
})
export class LabsRestService {
  constructor(private http: HttpClient) {}

  public getLabWork(subjectId: number): Observable<Lab[]> {
    return this.http
      .get('/Services/Labs/LabsService.svc/GetLabs/' + subjectId)
      .pipe(map((res) => res['Labs']))
  }

  public getProtectionSchedule(
    subjectId: number,
    groupId: number
  ): Observable<{
    labs: Lab[]
    scheduleProtectionLabs: ScheduleProtectionLab[]
    subGroups: SubGroup[]
  }> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString())
    return this.http
      .get('Services/Labs/LabsService.svc/GetLabsV2', { params })
      .pipe(
        map((res) => {
          return {
            labs: res['Labs'],
            scheduleProtectionLabs: res['ScheduleProtectionLabs'],
            subGroups: res['SubGroups'],
          }
        })
      )
  }

  getSubGroups(subjectId: number, groupId: number): Observable<SubGroup[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString())
    return this.http.get<SubGroup[]>(
      'Services/Labs/LabsService.svc/GetSubGroups',
      { params }
    )
  }

  public getMarksV2(
    subjectId: number,
    groupId: number
  ): Observable<{ students: StudentMark[]; testsCount: number }> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString())
    return this.http
      .get('Services/Labs/LabsService.svc/GetMarksV3', { params })
      .pipe(
        map((res) => ({
          students: res['Students'],
          testsCount: res['TestsCount'],
        }))
      )
  }

  public saveLab(lab: CreateLessonEntity) {
    return this.http.post('Services/Labs/LabsService.svc/Save', lab)
  }
  public updateLabsOrder(
    subjectId: number,
    prevIndex: number,
    curIndex: number
  ) {
    return this.http.post('Services/Labs/LabsService.svc/UpdateLabsOrder', {
      subjectId,
      prevIndex,
      curIndex,
    })
  }

  public updateLabs(labs: UpdateLab[]) {
    return this.http.post('Services/Labs/LabsService.svc/UpdateLabs', { labs })
  }

  public deleteLab(lab: { id: number; subjectId: number }) {
    return this.http.post('Services/Labs/LabsService.svc/Delete', lab)
  }

  public setLabsVisitingDate(body: {
    Id: number[]
    comments: string[]
    dateId: number
    marks: string[]
    showForStudents: boolean[]
    students: StudentMark[]
  }): Observable<any> {
    return this.http.post(
      'Services/Labs/LabsService.svc/SaveLabsVisitingData',
      body
    )
  }

  public setLabsMark(body: {
    studentId: number
    labId: number
    mark: string
    comment: string
    date: string
    id: number
    showForStudent: boolean
  }): Observable<any> {
    return this.http.post(
      'Services/Labs/LabsService.svc/SaveStudentLabsMark',
      body
    )
  }

  removeLabsMark(id: number): Observable<any> {
    return this.http.post(
      'Services/Labs/LabsService.svc/RemoveStudentLabsMark',
      { id }
    )
  }

  public getUserLabFiles(
    userId: number,
    subjectId: number
  ): Observable<UserLabFile[]> {
    const params = new HttpParams()
      .append('userId', userId.toString())
      .append('subjectId', subjectId.toString())
    return this.http
      .get('Services/Labs/LabsService.svc/GetUserLabFiles', { params })
      .pipe(map((res) => res['UserLabFiles']))
  }

  public getLabsMarksExcel(
    subjectId: number,
    groupId: number
  ): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString())
    const headers = new HttpHeaders()
    return this.http.get(`Statistic/GetLabsMarks`, {
      params,
      responseType: 'blob',
      observe: 'response',
    })
  }

  public getVisitLabsExcel(
    subjetId: number,
    groupId: number
  ): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('subjectId', subjetId.toString())
      .set('groupId', groupId.toString())
    return this.http.get('Statistic/GetVisitLabs', {
      params,
      responseType: 'blob',
      observe: 'response',
    })
  }

  public getLabsZip(
    subjectId: number,
    groupId: number
  ): Observable<HttpResponse<ArrayBuffer>> {
    const params = new HttpParams()
      .set('id', groupId.toString())
      .set('subjectId', subjectId.toString())
    return this.http.get('Subject/GetZipLabs', {
      params,
      responseType: 'arraybuffer',
      observe: 'response',
    })
  }

  public hasJobProtections(
    subjectId: number,
    isActive: boolean
  ): Observable<HasGroupJobProtection[]> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('isActive', String(isActive))

    return this.http
      .get('Services/Labs/LabsService.svc/HasSubjectLabsJobProtection', {
        params,
      })
      .pipe(map((response) => response['HasGroupsJobProtection']))
  }

  public getGroupJobProtection(
    subjectId: number,
    groupId: number
  ): Observable<GroupJobProtection> {
    const params = new HttpParams()
      .append('subjectId', subjectId.toString())
      .append('groupId', groupId.toString())
    return this.http.get<GroupJobProtection>(
      'Services/Labs/LabsService.svc/GroupJobProtection',
      { params }
    )
  }

  public getStudentJobProtection(
    subjectId: number,
    groupId: number,
    studentId: number
  ): Observable<StudentJobProtection> {
    const params = new HttpParams()
      .append('subjectId', subjectId.toString())
      .append('studentId', studentId.toString())
      .append('groupId', groupId.toString())
    return this.http.get<StudentJobProtection>(
      'Services/Labs/LabsService.svc/StudentJobProtection',
      { params }
    )
  }
}
