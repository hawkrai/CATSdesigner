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

  loadData() {
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
      res.Code === '200' && this.loadData()
    })
  }

  public deleteDateVisit(body: {id: string}) {
    this.rest.deleteDateVisit(body).subscribe(res => {
      res.Code === '200' && this.loadData()
    })
  }

  public setLabsVisitingDate(body) {
    return this.rest.setLabsVisitingDate(body);
  }

  public setLabsMark(body): Observable<any> {
    return this.rest.setLabsMark(body);
  }

  public getFilesLab(body: {subjectId: string, userId: number}): Observable<any> {
    return this.rest.getFilesLab(body);
  }

  public deleteUserFile(body: {id: string}): Observable<any> {
    return this.rest.deleteUserFile(body);
  }

  public sendUserFile(body): Observable<any> {
    return this.rest.sendUserFile(body);
  }

  public getAllStudentFilesLab(subjectId: string, groupId: string): Observable<any> {
    return this.rest.getAllStudentFilesLab(subjectId, groupId);
  }

  public receivedLabFile(body: {userFileId: number}): Observable<any> {
    return this.rest.receivedLabFile(body);
  }

  public cancelReceivedLabFile(body: {userFileId: number}): Observable<any> {
    return this.rest.cancelReceivedLabFile(body);
  }

  public checkPlagiarism(body: {subjectId: string, userFileId: number}): Observable<any> {
    return this.rest.checkPlagiarism(body);
  }

  public checkPlagiarismSubjects(body: {subjectId: string, threshold: string, type: string}): Observable<any> {
    return this.rest.checkPlagiarismSubjects(body);
  }
}
