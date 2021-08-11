import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatisitcsServiceService {

  constructor(private http: HttpClient) { }

  getSubjectOwner(groupId: any): Observable<any> {
    return this.http.get<any>('/Services/Parental/ParentalService.svc/LoadGroup?groupId=' + groupId);
  }

  getLabsStastics(subjectId: any, groupId: any): Observable<any> {
    return this.http.get<any>('/Services/Labs/LabsService.svc/GetMarksV2?subjectID=' + subjectId + '&groupID=' + groupId);
  }

  getTestStastics(subjectId: any, groupId: any): Observable<any> {
    return this.http.get<any>('/subject/Services/Labs/LabsService.svc/GetMarksV3?subjectID=' + subjectId + '&groupID=' + groupId);
  }

  getPracticalStastics(subjectId: any, groupId: any): Observable<any> {
    return this.http.get<any>('/Services/Practicals/PracticalService.svc/GetMarks?subjectID=' + subjectId + '&groupID=' + groupId);
  }


  getAllSubjects(username: string): Observable<any> {
    return this.http.post<any>('/Profile/GetProfileInfoSubjects', {userLogin: username});
  }

  getUserInfo(id: string): Observable<any> {
    return this.http.get<any>('/Profile/GetProfileInfoById/' + id);
  }

}
