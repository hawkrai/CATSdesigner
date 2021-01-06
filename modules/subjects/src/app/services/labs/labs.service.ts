import { Store } from '@ngrx/store';
import { StudentMark } from './../../models/student-mark.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Lab} from "../../models/lab.model";
import {LabsRestService} from './labs-rest.service';
import * as labSelectors from '../../store/selectors/labs.selectors';
import { IAppState } from 'src/app/store/state/app.state';

@Injectable({
  providedIn: 'root'
})

export class LabsService {

  constructor(
    private rest: LabsRestService) {
  }
  
  public checkPlagiarismSubjects(body: {subjectId: number, threshold: string, type: string}): Observable<any> {
    return this.rest.checkPlagiarismSubjects(body);
  }

}
