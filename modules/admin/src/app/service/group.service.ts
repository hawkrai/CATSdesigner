import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Group, LecturerGroup } from '../model/group'
import { Page } from '../model/page'
import { StudentByGroup } from '../model/student'

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  api = '/Administration/'
  apiStudent = '/Services/CoreService.svc/'

  constructor(private http: HttpClient) {}

  getStudentsByGroupId(groupId): Observable<StudentByGroup> {
    return this.http.get<StudentByGroup>(
      this.apiStudent + 'GetStudentsByGroupId/' + groupId
    )
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.api + 'GetGroupsJson')
  }

  getGroupsPaged(
    pageIndex: number,
    pageSize: number,
    filter: string = null,
    orderBy: string = null,
    sortDirection: number = 0
  ): Observable<Page<Group>> {
    let params = {
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    }

    if (filter != null && filter.trim() != '') {
      params['filter'] = filter
    }

    if (orderBy != null && orderBy.trim() != '') {
      params['orderBy'] = orderBy
      params['sortDirection'] = sortDirection.toString()
    }

    return this.http.get<Page<Group>>(this.api + 'GetGroupsPagedJsonAsync', {
      params: params,
    })
  }

  getGraduateGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.api + 'getGraduateGroupsJson')
  }

  getGroupById(groupId): Observable<Group> {
    return this.http.get<Group>(this.api + 'GetGroupJson/' + groupId)
  }

  addGroup(group): Observable<Group> {
    return this.http.post<Group>(this.api + 'SaveGroupJson', group)
  }

  deleteGroup(groupId): Observable<void> {
    return this.http.get<void>(this.api + 'DeleteGroupJson/' + groupId)
  }

  getListOfGroupsByLecturerId(lectureId): Observable<LecturerGroup> {
    return this.http.get<LecturerGroup>(
      this.api + 'ListOfGroupsByLecturerJson/' + lectureId
    )
  }
}
