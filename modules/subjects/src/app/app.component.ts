import {Component, OnInit} from '@angular/core';
import {GroupsService} from './services/groups/groups.service';
import {IAppState} from './store/state/app.state';
import {Store} from '@ngrx/store';
import {SetSubject, SetUser} from './store/actions/subject.actions';
import {User} from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'lmsNew';

  constructor(private groupsService: GroupsService,
              private store: Store<IAppState>) { }

  ngOnInit(): void {
    // localStorage.setItem('currentSubject', JSON.stringify({id: "2026", Name:"Тестирование ПО"}));
    // localStorage.setItem('currentUser', JSON.stringify({id: 2, role: 'lector', userName: 'popova'}));
    const group: {id: '', Name: ''} = JSON.parse(localStorage.getItem('currentSubject'));
    const user: User = JSON.parse(localStorage.getItem('currentUser'));
    group && this.store.dispatch(new SetSubject(group));
    user && this.store.dispatch(new SetUser(user));
    this.groupsService.loadDate();

  }
}
