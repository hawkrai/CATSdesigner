import { Practical } from './../../models/practical.model'
import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { CreateLessonEntity } from 'src/app/models/form/create-lesson-entity.model'
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model'
import { StudentMark } from 'src/app/models/student-mark.model'
import { HasGroupJobProtection } from 'src/app/models/job-protection/has-group-job-protection.model'
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode'

@Injectable({
  providedIn: 'root',
})
export class PracticalRestService {
  constructor(private http: HttpClient) {}

  public getPracticals(subjectId: number): Observable<Practical[]> {
    return this.http
      .get(
        'Services/Practicals/PracticalService.svc/GetPracticals/' + subjectId
      )
      .pipe(map((res) => res['Practicals']))
  }
  public getProtectionSchedule(
    subjectId: number,
    groupId: number
  ): Observable<{
    practicals: Practical[]
    scheduleProtectionPracticals: ScheduleProtectionPractical[]
  }> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString())
    return this.http
      .get('Services/Practicals/PracticalService.svc/GetPracticalsV2', {
        params,
      })
      .pipe(
        map((res) => {
          return {
            practicals: res['Practicals'],
            scheduleProtectionPracticals: res['ScheduleProtectionPracticals'],
          }
        })
      )
  }

  public getMarks(
    subjectId: number,
    groupId: number
  ): Observable<{ students: StudentMark[]; testsCount: number }> {
    return this.http
      .post('Services/Practicals/PracticalService.svc/GetMarks', {
        subjectId,
        groupId,
      })
      .pipe(
        map((res) => ({
          students: res['Students'],
          testsCount: res['TestsCount'],
        }))
      )
  }

  public updatePracticalsOrder(
    subjectId: number,
    prevIndex: number,
    curIndex: number
  ): Observable<any> {
    return this.http.post(
      'Services/Practicals/PracticalService.svc/UpdatePracticalsOrder',
      { subjectId, prevIndex, curIndex }
    )
  }

  public savePractical(practicalLesson: CreateLessonEntity): Observable<any> {
    return this.http.post(
      'Services/Practicals/PracticalService.svc/Save',
      practicalLesson
    )
  }
  public updatePractical(prac) {
    return this.http.post(
      'Services/Schedule/ScheduleService.svc/SaveDatePractical',
      { ...prac }
    )
  }

  public deletePractical(practicalLesson: {
    id: number
    subjectId: number
  }): Observable<any> {
    return this.http.post(
      'Services/Practicals/PracticalService.svc/Delete',
      practicalLesson
    )
  }

  public setPracticalsVisitingDate(body: {
    Id: number[]
    comments: string[]
    dateId: number
    marks: string[]
    showForStudents: boolean[]
    students: StudentMark[]
    subjectId: number
  }): Observable<any> {
    return this.http.post(
      'Services/Practicals/PracticalService.svc/SavePracticalsVisitingData',
      body
    )
  }

  public setPracticalMark(body: {
    studentId: number
    practicalId: number
    mark: string
    comment: string
    date: string
    id: number
    showForStudent: boolean
    subjectId: number
  }): Observable<any> {
    return this.http.post(
      'Services/Practicals/PracticalService.svc/SaveStudentPracticalMark',
      body
    )
  }

  public getPracticalsMarksExcel(
    subjectId: number,
    groupId: number
  ): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString())
    const headers = new HttpHeaders()
    return this.http.get(`Statistic/GetPracticalsMarks`, {
      params,
      responseType: 'blob',
      observe: 'response',
    })
  }

  public getVisitPrcaticalsExcel(
    subjetId: number,
    groupId: number
  ): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('subjectId', subjetId.toString())
      .set('groupId', groupId.toString())
    return this.http.get('Statistic/GetVisitPracticals', {
      params,
      responseType: 'blob',
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
      .get(
        'Services/Practicals/PracticalService.svc/HasSubjectPracticalsJobProtection',
        { params }
      )
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
      'Services/Practicals/PracticalService.svc/GroupJobProtection',
      { params }
    )
  }

  public getUserPracticalFiles(
    userId: number,
    subjectId: number
  ): Observable<UserLabFile[]> {
    const params = new HttpParams()
      .append('userId', userId.toString())
      .append('subjectId', subjectId.toString())
    return this.http
      .get('Services/Practicals/PracticalService.svc/GetUserPracticalFiles', {
        params,
      })
      .pipe(map((res) => res['UserLabFiles']))
  }

  public getPracticalsZip(
    subjectId: number,
    groupId: number
  ): Observable<HttpResponse<ArrayBuffer>> {
    const params = new HttpParams()
      .set('id', groupId.toString())
      .set('subjectId', subjectId.toString())
    return this.http.get('Subject/GetZipPracticals', {
      params,
      responseType: 'arraybuffer',
      observe: 'response',
    })
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
      'Services/Practicals/PracticalService.svc/StudentJobProtection',
      { params }
    )
  }
}
