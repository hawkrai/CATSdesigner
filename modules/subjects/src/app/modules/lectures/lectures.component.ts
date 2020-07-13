import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getSubjectId, getUser} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {GroupsService} from '../../services/groups/groups.service';

@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.less']
})
export class LecturesComponent implements OnInit {

  public tab = 1;
  public teacher = false;

  private subjectId: string;

  constructor(private store: Store<IAppState>,
              private groupsService: GroupsService,) {
  }

  ngOnInit() {
    this.groupsService.loadDate();
    this.store.pipe(select(getUser)).subscribe(user => {
      if (user && user.role.toLowerCase() === 'lector') {
        this.teacher = true;
      }
    });
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
    });
  }

}
