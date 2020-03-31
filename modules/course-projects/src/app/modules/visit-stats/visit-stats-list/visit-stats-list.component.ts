import {Component, Input, OnInit} from '@angular/core';
import {VisitStats} from '../../../models/visit-stats.model';

@Component({
  selector: 'app-visit-stats-list',
  templateUrl: './visit-stats-list.component.html',
  styleUrls: ['./visit-stats-list.component.less']
})
export class VisitStatsListComponent implements OnInit {

  @Input() visitStatsList: VisitStats[];

  constructor() {
  }

  ngOnInit() {
  }

}
