import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PercentageResult} from '../../models/percentage-result.model';
import {ProjectGroupService} from '../../services/project-group.service';
import {Group} from '../../models/group.model';
import {PercentageResultsService} from '../../services/percentage-results.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-percentage-results',
  templateUrl: './percentage-results.component.html',
  styleUrls: ['./percentage-results.component.less']
})
export class PercentageResultsComponent implements OnInit {

  private COUNT = 1000;
  private PAGE = 1;

  private percentageResults: PercentageResult[];
  private groups: Group[];

  private percentageResultsSubscription: Subscription;

  private subjectId: string;
  private groupId: number;
  private searchString = '';

  constructor(private projectGroupService: ProjectGroupService,
              private percentageResultsService: PercentageResultsService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;
    this.projectGroupService.getGroups(this.subjectId).subscribe(res => {
      this.groups = res;
      this.groupId = this.groups[0].Id;
      this.retrievePercentageResults();
    });
  }

  retrievePercentageResults() {
    this.percentageResultsSubscription = this.percentageResultsService.getPercentageResults({
      count: this.COUNT,
      page: this.PAGE,
      filter: '{"groupId":' + this.groupId +
        ',"subjectId":"' + this.subjectId + '",' +
        '"secretaryId":' + this.groupId + ',' +
        '"searchString":"' + this.searchString + '"}',
    })
      .subscribe(res => this.percentageResults = res.Students.Items);
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText;
    this.updateStats();
  }

  onGroupChange(groupId: number) {
    this.groupId = groupId;
    this.updateStats();
  }

  updateStats() {
    if (this.percentageResultsSubscription) {
      this.percentageResultsSubscription.unsubscribe();
    }
    this.retrievePercentageResults();
  }

}
