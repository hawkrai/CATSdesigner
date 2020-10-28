import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {PracticalRestService} from './practical-rest.service';
import {Observable} from 'rxjs';
import {Lecture} from '../../models/lecture.model';

@Injectable({
  providedIn: 'root'
})

export class PracticalService {

  constructor(private store$: Store<IAppState>,
              private rest: PracticalRestService) {
  }

  public getAllPracticalLessons(subjectId: number): Observable<Lecture[]> {
    return this.rest.getAllPracticalLessons(subjectId);
  }

  public getMarks(subjectId: number, groupId: string): Observable<any> {
    return this.rest.getMarks(subjectId, groupId);
  }

  public createPracticalLessons(practicalLesson) {
    return this.rest.createPracticalLessons(practicalLesson);
  }

  public deletePracticalLessons(practicalLesson: {id: string, subjectId: number}) {
    return this.rest.deletePracticalLessons(practicalLesson);
  }

}
