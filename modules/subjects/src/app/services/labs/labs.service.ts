import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Lab} from "../../models/lab.model";
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {LabsRestService} from './labs-rest.service';
import {LoadLabs} from '../../store/actions/labs.actions';
import {getLabs, getLabsCalendar} from '../../store/selectors/labs.selectors';

@Injectable({
  providedIn: 'root'
})

export class LabsService {

  constructor(private store$: Store<IAppState>,
              private rest: LabsRestService) {
  }

  loadDate() {
    this.store$.dispatch(new LoadLabs());
  }

  public getLabsProtectionSchedule() {
    return this.store$.pipe(select(getLabs));
  }

  public getCalendar() {
    return this.store$.pipe(select(getLabsCalendar))
  }

  public getLabWork(subjectId: string): Observable<Lab[]> {
    return this.rest.getLabWork(subjectId);
  }

  public getMarks(subjectId: string, groupId: string): Observable<any> {
    return this.rest.getMarks(subjectId, groupId);
  }

  public createLab(lab: Lab) {
    return this.rest.createLab(lab);
  }

  public deleteLab(lab: {id: string, subjectId: string}) {
    return this.rest.deleteLab(lab);
  }

  public createDateVisit(body: {subGroupId: string, date: string}) {
    this.rest.createDateVisit(body).subscribe(res => {
      res.Code === '200' && this.loadDate()
    })
  }

  public deleteDateVisit(body: {id: string}) {
    this.rest.deleteDateVisit(body).subscribe(res => {
      res.Code === '200' && this.loadDate()
    })
  }

  public setLabsVisitingDate(body) {
    return this.rest.setLabsVisitingDate(body);
  }

  public setLabsMark(body): Observable<any> {
    return this.rest.setLabsMark(body);
  }
}
