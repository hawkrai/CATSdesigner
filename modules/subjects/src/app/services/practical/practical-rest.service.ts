import { Practical } from './../../models/practical.model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { CreateLessonEntity } from 'src/app/models/form/create-lesson-entity.model';

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

  public getMarks(subjectId: number, groupId: number): Observable<any> {
    return this.http.post('Services/Practicals/PracticalService.svc/GetPracticalsVisitingData', {subjectId, groupId})
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
}
