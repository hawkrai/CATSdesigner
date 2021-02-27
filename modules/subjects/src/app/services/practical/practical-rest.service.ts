import { Practical } from './../../models/practical.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { CreateLessonEntity } from 'src/app/models/form/create-lesson-entity.model';
import { PracticalVisitingMark } from 'src/app/models/visiting-mark/practical-visiting-mark.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { StudentMark } from 'src/app/models/student-mark.model';

@Injectable({
  providedIn: 'root'
})

export class PracticalRestService {

  constructor(private http: HttpClient) {
  }

  public getPracticals(subjectId: number): Observable<Practical[]> {
    return this.http.get('Services/Practicals/PracticalService.svc/GetPracticals/' + subjectId).pipe(
      map(res => res['Practicals'])
    );
  }
  public getProtectionSchedule(subjectId: number, groupId: number): Observable<{ 
    practicals: Practical[], 
    scheduleProtectionPracticals: ScheduleProtectionPractical[]}> {
    const params = new HttpParams()
      .set('subjectId', subjectId.toString())
      .set('groupId', groupId.toString());
    return this.http.get('Services/Practicals/PracticalService.svc/GetPracticalsV2', {params}).pipe(
      map(res => {
        return {practicals: res['Practicals'],
        scheduleProtectionPracticals: res['ScheduleProtectionPracticals']}
      })
    );
  }

  public getMarks(subjectId: number, groupId: number): Observable<StudentMark[]> {
    return this.http.post('Services/Practicals/PracticalService.svc/GetMarks', { subjectId, groupId }).pipe(
      map(res => res['Students'])
    )
  }

  public updatePracticalsOrder(subjectId: number, prevIndex: number, curIndex: number): Observable<any> {
    return this.http.post('Services/Practicals/PracticalService.svc/UpdatePracticalsOrder', { subjectId, prevIndex, curIndex });
  }

  public savePractical(practicalLesson: CreateLessonEntity): Observable<any> {
    return this.http.post('Services/Practicals/PracticalService.svc/Save', practicalLesson);
  }

  public deletePractical(practicalLesson: {id: number, subjectId: number}): Observable<any> {
    return this.http.post('Services/Practicals/PracticalService.svc/Delete', practicalLesson);
  }

  public setPracticalsVisitingDate(body: { Id: number[], comments: string[], dateId: number, marks: string[], showForStudents: boolean[], students: StudentMark[], subjectId: number }): Observable<any> {
    return this.http.post('Services/Practicals/PracticalService.svc/SavePracticalsVisitingData', body);
  }

  public setPracticalMark(body: { studentId: number, practicalId: number, mark: string, comment: string, date: string, id: number, showForStudent: boolean } ): Observable<any> {
    return this.http.post('Services/Practicals/PracticalService.svc/SaveStudentPracticalMark', body);
  }

}
