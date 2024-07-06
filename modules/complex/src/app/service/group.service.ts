import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Group } from '../models/Group'
import { ConverterService } from './converter.service'
import { Student } from '../models/student.model'

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private path: string

  constructor(
    private http: HttpClient,
    private converterService: ConverterService
  ) {
    this.path = '/Services/CoreService.svc/'
  }

  public getGroups(subjectId: string): Observable<Group[]> {
    return this.http
      .get(this.path + 'GetOnlyGroups/' + subjectId)
      .pipe(map((res) => this.converterService.groupsConverter(res['Groups'])))
  }

  public getStudentsByGroup(groupId: string): Observable<Student[]> {
    return this.http
      .get(this.path + 'GetStudentsByGroupId/' + groupId)
      .pipe(
        map((res) => this.converterService.studentsConverter(res['Students']))
      )
  }
}
