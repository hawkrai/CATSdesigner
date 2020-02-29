import {Component, OnInit} from '@angular/core';
import {VisitStats} from '../../models/visit-stats.model';
import {ProjectGroupService} from '../../services/project-group.service';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../models/group.model';
import {VisitStatsService} from '../../services/visit-stats.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-visit-stats',
  templateUrl: './visit-stats.component.html',
  styleUrls: ['./visit-stats.component.less']
})
export class VisitStatsComponent implements OnInit {

  private COUNT = 1000;
  private PAGE = 1;

  private visitStatsSubscription: Subscription;

  private visitStatsList: VisitStats[];
  private groups: Group[];

  private subjectId: string;
  private groupId: number;
  private searchString = '';

  constructor(private projectGroupService: ProjectGroupService,
              private visitStatsService: VisitStatsService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;
    this.projectGroupService.getGroups(this.subjectId).subscribe(res => {
      this.groups = res;
      this.groupId = this.groups[0].Id;
      this.retrieveVisitStats();
    });
  }

  retrieveVisitStats() {
    this.visitStatsSubscription = this.visitStatsService.getVisitStats({
      count: this.COUNT, page: this.PAGE,
      filter: '{"groupId":' + this.groupId + ',"subjectId":' + this.subjectId + ',"searchString":"' + this.searchString + '"}'
    })
      .subscribe(res => this.visitStatsList = res.Students.Items);
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
    if (this.visitStatsSubscription) {
      this.visitStatsSubscription.unsubscribe();
    }
    this.retrieveVisitStats();
  }

}
