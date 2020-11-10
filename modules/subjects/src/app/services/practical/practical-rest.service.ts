import { Practical } from './../../models/practical.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Lecture} from '../../models/lecture.model';
import {map, tap} from 'rxjs/operators';
import {Lab} from '../../models/lab.model';

@Injectable({
  providedIn: 'root'
})

export class PracticalRestService {

  constructor(private http: HttpClient) {
  }

  public getAllPracticalLessons(subjectId: number): Observable<Practical[]> {
    return this.http.get('Services/Practicals/PracticalService.svc/GetPracticals/' + subjectId).pipe(
      map(res => res['Practicals'])
    );
  }

  public getMarks(subjectId: number, groupId: string): Observable<any> {
    return this.http.post('Services/Practicals/PracticalService.svc/GetPracticalsVisitingData', {subjectId, groupId})
    // .pipe(
    //   tap(x => console.log(x)),

    //   map(res => res['Students']))
  }

  public updatePracticalsOrder(objs: { Id: number, Order: number}[]) {
    return this.http.post('Services/Practicals/PracticalService.svc/UpdateOrder', { objs });
  }

  public createPracticalLessons(practicalLesson) {
    return this.http.post('Services/Practicals/PracticalService.svc/Save', practicalLesson);
  }

  public deletePracticalLessons(practicalLesson: {id: string, subjectId: number}) {
    return this.http.post('Services/Practicals/PracticalService.svc/Delete', practicalLesson);
  }
}
