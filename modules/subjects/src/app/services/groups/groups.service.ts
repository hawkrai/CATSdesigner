import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {Observable} from 'rxjs';
import {LoadGroups} from '../../store/actions/groups.actions';
import {getGroups} from '../../store/selectors/groups.selectors';
import {Group} from '../../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  constructor(private store$: Store<IAppState>) {
  }

  loadDate() {
    this.store$.dispatch(new LoadGroups())
  }

  getAllGroups(): Observable<Group[]> {
    return this.store$.pipe(select(getGroups));
  }
}
