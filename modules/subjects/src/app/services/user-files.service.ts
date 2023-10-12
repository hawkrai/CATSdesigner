import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { UserLabFile } from '../models/user-lab-file.model'

@Injectable({ providedIn: 'root' })
export class UserFilesService {
  constructor(private http: HttpClient) {}

  public deleteUserFile(id: number): Observable<any> {
    return this.http.post(
      'Services/UserFiles/UserFilesService.svc/DeleteUserFile',
      { id }
    )
  }

  public sendUserFile(body: {
    subjectId: number
    userId: number
    id: number
    comments: string
    pathFile: string
    attachments: string
    labId?: number
    practicalId?: number
  }): Observable<UserLabFile> {
    return this.http.post<UserLabFile>(
      'Services/UserFiles/UserFilesService.svc/SendFile',
      body
    )
  }

  public receiveFile(userFileId: number): Observable<any> {
    return this.http.post(
      'Services/UserFiles/UserFilesService.svc/ReceivedFile',
      { userFileId }
    )
  }

  public cancelFile(userFileId: number): Observable<any> {
    return this.http.post(
      'Services/UserFiles/UserFilesService.svc/CancelReceivedFile',
      { userFileId }
    )
  }

  public returnFile(userFileId: number): Observable<any> {
    return this.http.post(
      'Services/UserFiles/UserFilesService.svc/ReturnFile',
      { userFileId }
    )
  }

  public checkPlagiarism(
    subjectId: number,
    userFileId: number,
    isLab = false,
    isPractical = false
  ): Observable<any> {
    return this.http.post(
      'Services/UserFiles/UserFilesService.svc/CheckPlagiarism',
      { userFileId, subjectId, isLab: !!isLab, isPractical: !!isPractical }
    )
  }

  public checkPlagiarismSubjects(body: {
    subjectId: number
    type: string
    threshold: string
    isLab: boolean
    isPractical: boolean
  }): Observable<any> {
    return this.http.post(
      'Services/UserFiles/UserFilesService.svc/CheckPlagiarismSubjects',
      { ...body, isLab: !!body.isLab, isPractical: !!body.isPractical }
    )
  }
}
