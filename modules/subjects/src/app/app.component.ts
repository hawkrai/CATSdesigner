import {Component, OnInit} from '@angular/core';
import {GroupsService} from './services/groups/groups.service';
import {IAppState} from './store/state/app.state';
import {Store} from '@ngrx/store';
import * as subjectActions from './store/actions/subject.actions';
import {CatsMessageService} from './services/cats.message';
import {User} from './models/user.model';
import {Subject} from './models/subject.model';
import {ActivatedRoute, Params, Route} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{

  title = 'lmsNew';

  constructor(private groupsService: GroupsService,
              private catsMessageService: CatsMessageService,
              private route: ActivatedRoute,
              private store: Store<IAppState>) { }

  ngOnInit(): void {
    this.catsMessageService.setupMessageCommunication();
    // localStorage.setItem('currentSubject', JSON.stringify({id: "2026", Name:"Тестирование ПО"}));
    // localStorage.setItem('currentUser', JSON.stringify({id: 2, role: 'lector', userName: 'popova'}));
    const subject = JSON.parse(localStorage.getItem('currentSubject'));
    const user = JSON.parse(localStorage.getItem('currentUser')) as User;
    if (subject) {
      this.store.dispatch(subjectActions.setSubjectId({ id: subject.id }));
    }
    this.store.dispatch(subjectActions.setUser({ user }));

  }
}
