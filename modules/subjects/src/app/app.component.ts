import {Component, OnInit} from '@angular/core';
import {IAppState} from './store/state/app.state';
import {Store} from '@ngrx/store';
import * as subjectActions from './store/actions/subject.actions';
import * as catsActions from './store/actions/cats.actions';
import {User} from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{

  title = 'lmsNew';

  constructor(
    private store: Store<IAppState>
    ) { }

  ngOnInit(): void {
    this.store.dispatch(catsActions.setupMessageCommunication());
    const subject = JSON.parse(localStorage.getItem('currentSubject'));
    const user = JSON.parse(localStorage.getItem('currentUser')) as User;
    if (subject) {
      this.store.dispatch(subjectActions.setSubject({ subject: { id: subject.id, color: subject.color } }));
    }
    this.store.dispatch(subjectActions.setUser({ user }));

  }
}
