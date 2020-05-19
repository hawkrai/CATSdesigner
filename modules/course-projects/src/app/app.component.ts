import {Component, OnInit} from '@angular/core';
import {ProjectGroupService} from './services/project-group.service';
import {IAppState} from './store/state/app.state';
import {select, Store} from '@ngrx/store';
import {Group} from './models/group.model';
import {MatOptionSelectionChange} from '@angular/material';
import {getSubjectId} from './store/selectors/subject.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  public tab = 1;
  public groups: Group[];
  public selectedGroup: Group;

  private subjectId: string;

  constructor(private projectGroupService: ProjectGroupService,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.projectGroupService.getGroups(this.subjectId).subscribe(res => {
        this.groups = res;
      });
    });
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.Id === event.source.value);
    }
  }

}
