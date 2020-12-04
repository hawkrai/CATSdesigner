import { Practical } from './../../models/practical.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Lecture} from '../../models/lecture.model';
import {map, tap} from 'rxjs/operators';
import {Lab} from '../../models/lab.model';
import { UpdateLab } from 'src/app/models/form/update-lab.model';
import { CreateEntity } from 'src/app/models/form/create-entity.model';
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

  public updatePracticals(practicals: UpdateLab[]) {
    return this.http.post('Services/Practicals/PracticalService.svc/UpdatePracticals', { practicals });
  }

  public savePractical(practicalLesson: CreateLessonEntity) {
    return this.http.post('Services/Practicals/PracticalService.svc/Save', practicalLesson);
  }

  public deletePractical(practicalLesson: {id: number, subjectId: number}) {
    return this.http.post('Services/Practicals/PracticalService.svc/Delete', practicalLesson);
  }
}
