import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {Observable} from 'rxjs';
import {LoadGroups, SetCurrentGroup} from '../../store/actions/groups.actions';
import {getGroups} from '../../store/selectors/groups.selectors';
import {Group} from '../../models/group.model';
import {GroupsRestService} from './groups-rest.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  constructor(private store$: Store<IAppState>,
              private rest: GroupsRestService) {
  }

  loadDate() {
    this.store$.dispatch(new LoadGroups())
  }

  getAllGroups(): Observable<Group[]> {
    return this.store$.pipe(select(getGroups));
  }

  setCurrentGroup(group: Group) {
    this.store$.dispatch(new SetCurrentGroup(group));
  }

  getAllOldGroups(subjectId: string): Observable<Group[]> {
    return this.rest.getAllOldGroups(subjectId);
  }
}
