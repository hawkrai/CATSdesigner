import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Lecture} from '../../models/lecture.model';
import {map} from 'rxjs/operators';
import {Lab} from '../../models/lab.model';

@Injectable({
  providedIn: 'root'
})

export class PracticalRestService {

  constructor(private http: HttpClient) {
  }

  public getAllPracticalLessons(subjectId: string): Observable<Lecture[]> {
    return this.http.get('Services/Practicals/PracticalService.svc/GetPracticals/' + subjectId).pipe(
      map(res => res['Practicals'])
    );
  }

  public getMarks(subjectId: string, groupId: string): Observable<any> {
    return this.http.post('Services/Practicals/PracticalService.svc/GetPracticalsVisitingData', {subjectId, groupId}).pipe(
      map(res => res['Students']))
  }

  public createPracticalLessons(practicalLesson) {
    return this.http.post('Services/Practicals/PracticalService.svc/Save', practicalLesson);
  }

  public deletePracticalLessons(practicalLesson: {id: string, subjectId: string}) {
    return this.http.post('Services/Practicals/PracticalService.svc/Delete', practicalLesson);
  }
}
